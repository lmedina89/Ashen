import test from 'node:test';
import assert from 'node:assert/strict';
import {terrainHeight,pathX,nearPath,seeded,clamp,distance2} from '../src/utils/math.js';

test('deterministic procedural road and terrain',()=>{
 assert.equal(pathX(20),pathX(20));
 assert.ok(Number.isFinite(pathX(-20)));
 assert.equal(terrainHeight(3,-18),terrainHeight(3,-18));
});
test('world height increases toward the distant keep',()=>{
 assert.ok(terrainHeight(pathX(-45),-45)>terrainHeight(pathX(55),55));
});
test('terrain rises on mountain shoulders',()=>{
 const z=15;
 assert.ok(terrainHeight(pathX(z)+30,z)>terrainHeight(pathX(z),z));
});
test('path corridor detection',()=>{
 assert.ok(nearPath(pathX(8),8,3));
 assert.ok(!nearPath(pathX(8)+15,8,3));
});
test('seed reproducibility and finite distances',()=>{
 const a=seeded(930),b=seeded(930);
 assert.deepEqual([a(),a(),a()],[b(),b(),b()]);
 assert.equal(distance2({x:0,z:0},{x:3,z:4}),5);
 assert.equal(clamp(10,0,5),5);
});
