import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';

const [renovateRoot, presetPath] = process.argv.slice(2);
const { init } = await import(pathToFileURL(resolve(renovateRoot, 'dist/logger/index.js')));
await init();
const { applyPackageRules } = await import(pathToFileURL(resolve(renovateRoot, 'dist/util/package-rules/index.js')));
const preset = JSON.parse(await readFile(presetPath, 'utf8'));

function apply(dependency, localRules = []) {
  return applyPackageRules({
    datasource: 'npm',
    manager: 'npm',
    ...dependency,
    packageRules: [...preset.packageRules, ...localRules],
  });
}

test('lock file maintenance delegates inherited release age to package managers', async () => {
  const result = await apply({ updateType: 'lockFileMaintenance', minimumReleaseAge: '3 days' });
  assert.equal(result.minimumReleaseAge, null);
  assert.equal(preset.lockFileMaintenance.enabled, true);
});

for (const updateType of ['major', 'minor', 'patch', 'pin', 'digest', 'pinDigest', 'lockfileUpdate', 'rollback', 'bump', 'replacement']) {
  test(`${updateType} updates retain the consumer release-age policy`, async () => {
    const result = await apply({ packageName: 'unrelated-package', updateType, minimumReleaseAge: '3 days' });
    assert.equal(result.minimumReleaseAge, '3 days');
  });
}

test('consumer manager rules can disable unsupported maintenance without disabling other managers', async () => {
  const localRules = [{
    matchManagers: ['composer'],
    matchUpdateTypes: ['lockFileMaintenance'],
    enabled: false,
  }];
  const unsupported = await apply({ manager: 'composer', updateType: 'lockFileMaintenance' }, localRules);
  assert.equal(unsupported.enabled, false);
  const supported = await apply({ manager: 'npm', updateType: 'lockFileMaintenance' }, localRules);
  assert.notEqual(supported.enabled, false);
  const ordinary = await apply({ manager: 'composer', updateType: 'patch' }, localRules);
  assert.notEqual(ordinary.enabled, false);
});

for (const updateType of ['minor', 'patch']) {
  test(`${updateType} updates retain the routine group`, async () => {
    const result = await apply({ packageName: 'unrelated-package', updateType });
    assert.equal(result.groupName, 'non-major dependencies');
  });
}

test('unrelated majors do not enter the routine group', async () => {
  const result = await apply({ packageName: 'unrelated-package', updateType: 'major' });
  assert.equal(result.groupName, undefined);
});

for (const packageName of ['@sveltejs/kit', '@sveltejs/adapter-cloudflare', '@sveltejs/adapter-static']) {
  for (const updateType of ['major', 'minor', 'patch']) {
    test(`${packageName} ${updateType} updates use the upstream release group`, async () => {
      const result = await apply({ packageName, updateType, sourceUrl: 'https://github.com/sveltejs/kit' });
      assert.equal(result.groupName, 'SvelteKit');
    });
  }
}

test('consumer compatibility groups override both shared groups', async () => {
  const localRules = [{
    matchPackageNames: ['@sveltejs/kit', 'vite'],
    groupName: 'SvelteKit and Vite',
  }];
  for (const packageName of ['@sveltejs/kit', 'vite']) {
    const result = await apply({
      packageName,
      updateType: 'minor',
      sourceUrl: packageName === 'vite' ? 'https://github.com/vitejs/vite' : 'https://github.com/sveltejs/kit',
    }, localRules);
    assert.equal(result.groupName, 'SvelteKit and Vite');
  }
  const unrelated = await apply({ packageName: 'unrelated-package', updateType: 'patch' }, localRules);
  assert.equal(unrelated.groupName, 'non-major dependencies');
});
