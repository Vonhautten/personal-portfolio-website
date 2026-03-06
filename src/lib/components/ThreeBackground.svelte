<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';

    let canvas: HTMLCanvasElement;

    let threeModule: typeof import('three') | undefined;
    let scene: import('three').Scene | undefined;
    let camera: import('three').PerspectiveCamera | undefined;
    let renderer: import('three').WebGLRenderer | undefined;
    let frame: number | undefined;

    let logoGroup: import('three').Group | undefined;
    let starField: import('three').Points | undefined;
    let nearDust: import('three').Points | undefined;
    let dataRings: import('three').Mesh[] = [];
    let haloMeshes: import('three').Mesh[] = [];

    // 🌠 Shooting stars
    let shootingStars: {
        mesh: import('three').Mesh;
        vx: number; vy: number; vz: number;
        life: number; maxLife: number;
    }[] = [];

    // 🧊 Hologram scan rings
    let holoPlanes: import('three').Mesh[] = [];

    // 💎 Crystal facet planes
    let crystalFacets: import('three').Mesh[] = [];

    // 🌌 Cyber hex grid
    let cyberGrid: import('three').Points | undefined;

    // ✨ Neon core
    let neonCore: import('three').Mesh | undefined;
    let neonCoreOuter: import('three').Mesh | undefined;
    let bodyMesh: import('three').Mesh | undefined;

    let time = 0;
    let lastFrameTime = 0;
    let isVisible = true;
    let isPageVisible = true;
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let nextShootingStar = 2000;

    let hexValues: string[] = ['----', '----', '----'];

    const COLORS = {
        bg:    0x050505,
        neon:  0xB4FF00,
        cyan:  0x00E5FF,
        white: 0xffffff,
    };

    onMount(async () => {
        if (!browser || !canvas) return;

        const THREE = await import('three');
        threeModule = THREE;

        hexValues = Array(3).fill(0).map(() =>
            Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0').toUpperCase()
        );

        try {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(COLORS.bg);
            scene.fog = new THREE.FogExp2(COLORS.bg, 0.016);

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
            camera.position.z = 16;

            renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.9;

            // ── LIGHTING ──────────────────────────────────────────────────────
            scene.add(new THREE.AmbientLight(0x080808, 3));
            const keyLight = new THREE.PointLight(COLORS.neon, 5, 22);
            keyLight.position.set(3, 3, 7);
            scene.add(keyLight);
            const backLight = new THREE.PointLight(0x002200, 2, 14);
            backLight.position.set(-4, -2, -6);
            scene.add(backLight);
            const rimLight = new THREE.PointLight(COLORS.neon, 1.5, 10);
            rimLight.position.set(0, 6, -4);
            scene.add(rimLight);
            // 🌌 Cyber blue fill
            const cyberLight = new THREE.PointLight(COLORS.cyan, 1.2, 18);
            cyberLight.position.set(-5, 0, 5);
            scene.add(cyberLight);

            // ── STAR SHAPE (4-point ✦) ────────────────────────────────────────
            logoGroup = new THREE.Group();
            scene.add(logoGroup);

            const shape = new THREE.Shape();
            const outerR = 3.8, innerR = 1.1, pts = 4;
            for (let i = 0; i < pts * 2; i++) {
                const angle = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
                const r = i % 2 === 0 ? outerR : innerR;
                if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            shape.closePath();

            const extrudeOpts = {
                depth: 0.7,
                bevelEnabled: true,
                bevelThickness: 0.28,
                bevelSize: 0.28,
                bevelSegments: 4,
            };
            const extGeo = new THREE.ExtrudeGeometry(shape, extrudeOpts);
            extGeo.center();

            // 💎 ELEGANT: main body — metallic dark with emissive
            const bodyMat = new THREE.MeshStandardMaterial({
                color: 0x0d0d0d,
                emissive: new THREE.Color(COLORS.neon),
                emissiveIntensity: 0.42,
                metalness: 0.55,
                roughness: 0.12,
            });
            bodyMesh = new THREE.Mesh(extGeo, bodyMat);
            bodyMesh.renderOrder = 2;
            logoGroup.add(bodyMesh);

            // 💎 ELEGANT: subtle wireframe crystal edge overlay
            const wireMat = new THREE.MeshBasicMaterial({
                color: COLORS.neon,
                wireframe: true,
                transparent: true,
                opacity: 0.04,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const wireOverlay = new THREE.Mesh(extGeo, wireMat);
            wireOverlay.scale.setScalar(1.001);
            wireOverlay.renderOrder = 3;
            logoGroup.add(wireOverlay);

            // ✨ NEON CORE: white inner bright sphere
            neonCore = new THREE.Mesh(
                new THREE.SphereGeometry(0.55, 12, 12),
                new THREE.MeshBasicMaterial({
                    color: COLORS.white,
                    transparent: true,
                    opacity: 0.85,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                })
            );
            neonCore.renderOrder = 5;
            logoGroup.add(neonCore);

            // ✨ NEON outer glow sphere
            neonCoreOuter = new THREE.Mesh(
                new THREE.SphereGeometry(1.3, 10, 10),
                new THREE.MeshBasicMaterial({
                    color: COLORS.neon,
                    transparent: true,
                    opacity: 0.18,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.BackSide,
                })
            );
            neonCoreOuter.renderOrder = 4;
            logoGroup.add(neonCoreOuter);

            // FAKE HALO LAYERS
            const haloConfigs = [
                { radius: 6.2, opacity: 0.018 },
                { radius: 4.8, opacity: 0.040 },
                { radius: 3.6, opacity: 0.075 },
                { radius: 2.8, opacity: 0.115 },
            ];
            haloConfigs.forEach(({ radius, opacity }) => {
                const h = new THREE.Mesh(
                    new THREE.SphereGeometry(radius, 14, 14),
                    new THREE.MeshBasicMaterial({
                        color: COLORS.neon,
                        transparent: true,
                        opacity,
                        side: THREE.BackSide,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                    })
                );
                h.renderOrder = 0;
                logoGroup!.add(h);
                haloMeshes.push(h);
            });

            // 💎 CRYSTAL FACETS: diagonal lens-flare planes
            const facetAngles = [0, Math.PI/4, Math.PI/2, (3*Math.PI)/4];
            facetAngles.forEach((angle, i) => {
                const fGeo = new THREE.PlaneGeometry(0.012, 9.0);
                const fMat = new THREE.MeshBasicMaterial({
                    color: i % 2 === 0 ? COLORS.neon : COLORS.cyan,
                    transparent: true,
                    opacity: 0.08,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                });
                const f = new THREE.Mesh(fGeo, fMat);
                f.rotation.z = angle;
                f.rotation.x = Math.PI / 2;
                f.renderOrder = 1;
                logoGroup!.add(f);
                crystalFacets.push(f);
            });

            // DATA RINGS
            const ringConfigs = [
                { r: 5.0, op: 0.5,  tiltX: Math.PI/2 - 3,tiltZ: 1.5},
                { r: 5.5, op: 0.25, tiltX: Math.PI/2 - 3,tiltZ: 1.0},
                { r: 6.0, op: 0.35, tiltX: Math.PI/2 - 3,tiltZ: 1.8},
            ];
            ringConfigs.forEach((cfg, i) => {
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(cfg.r, 0.08, 6, 80),
                    new THREE.MeshBasicMaterial({
                        color: i === 1 ? COLORS.cyan : COLORS.neon,
                        transparent: true,
                        opacity: cfg.op,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                    })
                );
                ring.rotation.x = cfg.tiltX;
                ring.rotation.z = cfg.tiltZ;
                ring.userData = { baseOpacity: cfg.op, idx: i };
                dataRings.push(ring);
                logoGroup!.add(ring);
            });

            // 🧊 HOLOGRAM: flat ring planes that sweep upward
            for (let i = 0; i < 5; i++) {
                const hGeo = new THREE.RingGeometry(2.55 + i * 0.18, 2.57 + i * 0.18, 48);
                const hMat = new THREE.MeshBasicMaterial({
                    color: i % 2 === 0 ? COLORS.neon : COLORS.cyan,
                    transparent: true,
                    opacity: 0.0,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                });
                const hp = new THREE.Mesh(hGeo, hMat);
                hp.rotation.x = Math.PI / 2;
                hp.userData = { phase: i / 5 };
                scene.add(hp);
                holoPlanes.push(hp);
            }

            // 🌌 CYBER HEX GRID (background dots)
            const hexPos: number[] = [];
            const hexCol: number[] = [];
            const limeC = new THREE.Color(COLORS.neon);
            const cyanC = new THREE.Color(COLORS.cyan);
            for (let row = -10; row <= 10; row++) {
                for (let col = -18; col <= 18; col++) {
                    if (Math.random() > 0.28) continue;
                    const x = col * 1.25 + (row % 2) * 0.62;
                    const y = row * 1.08;
                    const z = -22 + Math.random() * 6;
                    if (Math.sqrt(x*x + y*y) > 19) continue;
                    hexPos.push(x, y, z);
                    const c = Math.random() > 0.6 ? cyanC : limeC;
                    hexCol.push(c.r, c.g, c.b);
                }
            }
            const hexGeo = new THREE.BufferGeometry();
            hexGeo.setAttribute('position', new THREE.Float32BufferAttribute(hexPos, 3));
            hexGeo.setAttribute('color', new THREE.Float32BufferAttribute(hexCol, 3));
            cyberGrid = new THREE.Points(hexGeo, new THREE.PointsMaterial({
                size: 0.45, vertexColors: true,
                transparent: true, opacity: 0.18,
                blending: THREE.AdditiveBlending, depthWrite: false,
            }));
            scene.add(cyberGrid);

            // 🌠 STAR FIELD — far layer
            const farCount = 320;
            const farPos = new Float32Array(farCount * 3);
            for (let i = 0; i < farCount; i++) {
                const r = 28 + Math.random() * 55;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                farPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
                farPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
                farPos[i*3+2] = r * Math.cos(phi);
            }
            const farGeo = new THREE.BufferGeometry();
            farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
            scene.add(new THREE.Points(farGeo, new THREE.PointsMaterial({
                color: COLORS.white, size: 0.055,
                transparent: true, opacity: 0.45,
                blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
            })));

            // Mid stars — white + neon tinted
            const midCount = 180;
            const midPos = new Float32Array(midCount * 3);
            const midCol = new Float32Array(midCount * 3);
            const whiteC = new THREE.Color(COLORS.white);
            for (let i = 0; i < midCount; i++) {
                const r = 14 + Math.random() * 22;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                midPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
                midPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
                midPos[i*3+2] = r * Math.cos(phi);
                const col = Math.random() < 0.65 ? whiteC : limeC;
                midCol[i*3] = col.r; midCol[i*3+1] = col.g; midCol[i*3+2] = col.b;
            }
            const midGeo = new THREE.BufferGeometry();
            midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
            midGeo.setAttribute('color', new THREE.BufferAttribute(midCol, 3));
            starField = new THREE.Points(midGeo, new THREE.PointsMaterial({
                size: 0.20, vertexColors: true,
                transparent: true, opacity: 0.55,
                blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
            }));
            scene.add(starField);

            // Near dust
            const nearCount = 90;
            const nearPos2 = new Float32Array(nearCount * 3);
            for (let i = 0; i < nearCount; i++) {
                const r = 5 + Math.random() * 9;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                nearPos2[i*3]   = r * Math.sin(phi) * Math.cos(theta);
                nearPos2[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
                nearPos2[i*3+2] = r * Math.cos(phi) - 2;
            }
            const nearGeo = new THREE.BufferGeometry();
            nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos2, 3));
            nearDust = new THREE.Points(nearGeo, new THREE.PointsMaterial({
                color: COLORS.neon, size: 0.20,
                transparent: true, opacity: 0.35,
                blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
            }));
            scene.add(nearDust);

            // ── VISIBILITY + SCROLL ───────────────────────────────────────────
            document.addEventListener('visibilitychange', () => {
                isPageVisible = document.visibilityState === 'visible';
            });
            new IntersectionObserver(
                (e) => { isVisible = e[0].isIntersecting; }, { threshold: 0 }
            ).observe(canvas);
            window.addEventListener('scroll', () => {
                isScrolling = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => { isScrolling = false; }, 150);
            }, { passive: true });

            animate(THREE);
            window.addEventListener('resize', onResize);

        } catch (err) {
            console.error('Three.js init error:', err);
        }
    });

    function spawnShootingStar(THREE: typeof import('three')) {
        if (!scene) return;
        const geo = new THREE.CylinderGeometry(0.007, 0.001, 0.9 + Math.random() * 1.3, 4, 1);
        const col = Math.random() > 0.45 ? COLORS.neon : COLORS.white;
        const mat = new THREE.MeshBasicMaterial({
            color: col, transparent: true, opacity: 0.9,
            blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const theta = Math.random() * Math.PI * 2;
        const startR = 11 + Math.random() * 7;
        mesh.position.set(
            Math.cos(theta) * startR,
            8 + Math.random() * 6,
            -6 + Math.random() * 10
        );
        const speed = 0.16 + Math.random() * 0.24;
        const vx = (Math.random() - 0.5) * speed * 0.5;
        const vy = -speed;
        const vz = (Math.random() - 0.5) * speed * 0.2;
        mesh.rotation.z = Math.atan2(vx, -vy);
        mesh.rotation.x = Math.PI / 2;
        scene.add(mesh);
        shootingStars.push({ mesh, vx, vy, vz, life: 0, maxLife: 50 + Math.random() * 45 });
    }

    function animate(THREE: typeof import('three')) {
        if (!scene || !camera || !renderer) return;
        frame = requestAnimationFrame(() => animate(THREE));

        if (!isPageVisible || !isVisible) return;

        const now = performance.now();
        const delta = now - lastFrameTime;
        const targetDelta = isScrolling ? 33 : 16;
        if (delta < targetDelta) return;
        lastFrameTime = now;
        time = now * 0.001;

        // ── LOGO GROUP ────────────────────────────────────────────────────────
        if (logoGroup) {
            logoGroup.rotation.y = time * 0.28;
            logoGroup.rotation.x = Math.sin(time * 0.22) * 0.12;
            logoGroup.rotation.z = Math.sin(time * 0.15) * 0.04;
            logoGroup.scale.setScalar(1 + Math.sin(time * 0.9) * 0.012);
        }

        // ✨ NEON CORE PULSE
        if (neonCore) {
            const m = neonCore.material as import('three').MeshBasicMaterial;
            m.opacity = 0.70 + Math.sin(time * 2.4) * 0.18;
            neonCore.scale.setScalar(1 + Math.sin(time * 2.4) * 0.09);
        }
        if (neonCoreOuter) {
            const m = neonCoreOuter.material as import('three').MeshBasicMaterial;
            m.opacity = 0.13 + Math.sin(time * 1.6 + 1.0) * 0.06;
        }

        // 💎 ELEGANT BODY: emissive pulse + subtle iridescent color drift
        if (bodyMesh) {
            const m = bodyMesh.material as import('three').MeshStandardMaterial;

            // hanya pulse brightness, bukan warna
            m.emissiveIntensity = 0.35 + Math.sin(time * 1.3) * 0.12;

            // warna tetap
            m.emissive.setHex(COLORS.neon);
        }

        // 💎 CRYSTAL FACETS: rotate + sharp flash
        crystalFacets.forEach((f, i) => {
            f.rotation.z = (i * Math.PI / 4) + time * 0.065 * (i % 2 === 0 ? 1 : -1);
            const m = f.material as import('three').MeshBasicMaterial;
            const flash = Math.max(0, Math.sin(time * 2.6 + i * 1.57)) ** 5;
            m.opacity = 0.04 + flash * 0.40;
        });

        // HALO PULSE
        haloMeshes.forEach((h, i) => {
            const m = h.material as import('three').MeshBasicMaterial;
            const base = [0.018, 0.040, 0.075, 0.115][i];
            m.opacity = base * (0.8 + 0.2 * Math.sin(time * 1.1 + i * 0.7));
        });

        // RING ROTATION
        dataRings.forEach((ring, i) => {
            ring.rotation.z += [0.0025, -0.0018, 0.0012][i];
            const m = ring.material as import('three').MeshBasicMaterial;
            m.opacity = ring.userData.baseOpacity * (0.75 + 0.25 * Math.sin(time * 1.8 + i * 1.4));
        });

        // 🧊 HOLOGRAM SCAN RINGS: sweep bottom → top
        holoPlanes.forEach((hp, i) => {
            const phase = hp.userData.phase as number;
            const cycleT = ((time * 0.38 + phase) % 1.0);
            hp.position.y = -4.5 + cycleT * 9.0;
            const fade = Math.sin(cycleT * Math.PI);
            const m = hp.material as import('three').MeshBasicMaterial;
            m.opacity = fade * (i % 2 === 0 ? 0.24 : 0.15);
            hp.scale.setScalar(1 + Math.sin(time * 1.2 + i) * 0.012);
        });

        // 🌌 CYBER GRID shimmer
        if (cyberGrid) {
            cyberGrid.rotation.z += 0.00008;
            const m = cyberGrid.material as import('three').PointsMaterial;
            m.opacity = 0.14 + Math.sin(time * 0.7) * 0.05;
        }

        // 🌠 SHOOTING STARS
        nextShootingStar -= delta;
        if (nextShootingStar <= 0) {
            spawnShootingStar(THREE);
            nextShootingStar = 1800 + Math.random() * 3400;
        }
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.life++;
            s.mesh.position.x += s.vx;
            s.mesh.position.y += s.vy;
            s.mesh.position.z += s.vz;
            const prog = s.life / s.maxLife;
            const m = s.mesh.material as import('three').MeshBasicMaterial;
            m.opacity = (prog < 0.15 ? prog / 0.15 : 1 - (prog - 0.15) / 0.85) * 0.9;
            if (s.life >= s.maxLife) {
                scene!.remove(s.mesh);
                s.mesh.geometry.dispose();
                (s.mesh.material as import('three').Material).dispose();
                shootingStars.splice(i, 1);
            }
        }

        // PARTICLES
        if (starField) { starField.rotation.y += 0.00012; starField.rotation.x += 0.000045; }
        if (nearDust) {
            nearDust.rotation.y -= 0.00022;
            nearDust.rotation.x += 0.00008;
            (nearDust.material as import('three').PointsMaterial).opacity =
                0.28 + Math.sin(time * 2.1) * 0.08;
        }

        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }

    function onResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function cleanup() {
        if (frame !== undefined) cancelAnimationFrame(frame);
        if (browser) window.removeEventListener('resize', onResize);
        scene?.traverse((obj) => {
            if (threeModule && obj instanceof threeModule.Mesh) {
                obj.geometry?.dispose();
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                mats.forEach((m: import('three').Material) => m?.dispose());
            }
        });
        renderer?.dispose();
        scene = undefined; camera = undefined; renderer = undefined;
        logoGroup = undefined; starField = undefined; nearDust = undefined;
        dataRings = []; haloMeshes = []; crystalFacets = []; holoPlanes = [];
        shootingStars = [];
    }

    onDestroy(() => cleanup());
</script>

<canvas
    bind:this={canvas}
    class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    style="will-change: transform; contain: strict;"
></canvas>

<!-- Hex decoration -->
<div class="fixed top-4 right-4 z-10 text-[#B4FF00]/15 font-mono text-[9px] tracking-widest pointer-events-none select-none">
    {#each hexValues as val, i}
        <div style="opacity: {0.35 - i * 0.09}">{val}</div>
    {/each}
</div>

<!-- Corner mark -->
<div class="fixed bottom-5 right-5 z-10 pointer-events-none">
    <div class="w-4 h-4 border border-[#B4FF00]/20 rotate-45"></div>
</div>

<!-- Scanline -->
<div
    class="fixed inset-0 pointer-events-none opacity-[0.025]"
    style="z-index: -5; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(180,255,0,0.4) 2px, rgba(180,255,0,0.4) 3px);"
></div>

<style>
    :global(body) {
        background: #050505;
        margin: 0;
        overflow-x: hidden;
    }
</style>