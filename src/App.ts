import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

declare var Detector: any;

export class App {

    private scene: THREE.Scene;
    private controls: OrbitControls;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private sample: THREE.Object3D;

    constructor() {

        if (!Detector.webgl) Detector.addGetWebGLMessage();

        this.onWindowResize = this.onWindowResize.bind(this);
        this.run = this.run.bind(this);

        this.init();
        this.run();
    }

    private init(): void {

        window.addEventListener("resize", () => this.onWindowResize());

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xFFFFFF));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        // this.renderer.gammaInput = true;
        // this.renderer.gammaOutput = true;
        // this.renderer.toneMapping = THREE.ReinhardToneMapping;
        // this.renderer.toneMappingExposure = 3;

        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(-455, 500, 750);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;

        this.controls.minDistance = 100;
        this.controls.maxDistance = 2500;

        this.controls.maxPolarAngle = Math.PI / 2;

        var axesHelper = new THREE.AxesHelper(100);
        axesHelper.position.set(-150, 10, -100);
        this.scene.add(axesHelper);

        // World
        var world = new THREE.Mesh(
            new THREE.BoxGeometry(1000, 1, 1000),
            new THREE.MeshLambertMaterial({ color: 0xFF637b80 })
        );
        world.receiveShadow = true;
        this.scene.add(world);

        // Sample object
        // this.sample = new THREE.Mesh(
        //     new THREE.PlaneGeometry(100, 1000),
        //     new THREE.MeshStandardMaterial({ color: "blue" })
        // );
        const material = new THREE.MeshStandardMaterial({
            metalness: .9,
            roughness: .1,
            envMapIntensity: 1,

        });

        // material.envMap = new THREE.TextureLoader().load("environment.jpg", (t) => {
        //     material.needsUpdate = true;
        // });
        //material.envMap.mapping = THREE.CubeReflectionMapping;

        const path = "environment.jpg";

        var urls = [
            path, path,
            path, path,
            path, path,
        ];

        var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        material.envMap = reflectionCube;

        // let pngCubeRenderTarget;
        // let pngBackground;

        // new THREE.TextureLoader().load("environment.jpg", (texture) => {

        //     texture.encoding = THREE.sRGBEncoding;

        //     var cubemapGenerator = new EquirectangularToCubeGenerator(texture, { resolution: 512 });
        //     pngBackground = cubemapGenerator.renderTarget;

        //     var cubeMapTexture = cubemapGenerator.update(this.renderer);

        //     var pmremGenerator = new PMREMGenerator(cubeMapTexture);
        //     pmremGenerator.update(this.renderer);

        //     var pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
        //     pmremCubeUVPacker.update(this.renderer);

        //     pngCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

        //     texture.dispose();
        //     pmremGenerator.dispose();
        //     pmremCubeUVPacker.dispose();

        // });

        // material.envMap = new THREE.TextureLoader().load("environment.jpg", (t) => {
        //     material.needsUpdate = true;
        // })

       // material.metalnessMap = material.roughnessMap = new THREE.TextureLoader().load("environment.jpg");

        this.sample = new THREE.Mesh(
            new THREE.BoxGeometry(50, 50, 50),
            material
        );
        this.sample.castShadow = true;
        this.sample.position.y = 80;
        this.sample.position.set(30, 80, 30);

        this.scene.add(this.sample);

        const deg = Math.PI / 180;

        //this.sample.rotateY(deg * 90);
        //this.sample.rotateX(deg * 270);

        // Lights
        // var spotLight = new THREE.SpotLight(0xFFFFFF);
        // spotLight.position.set(-40, 40, -15);
        // spotLight.position.copy(this.camera.position);
        // spotLight.position.x = -spotLight.position.x;
        // spotLight.castShadow = true;
        // spotLight.shadow.mapSize = new THREE.Vector2(1024 * 5, 1024 * 5);
        // spotLight.shadow.camera.far = 5000;
        // spotLight.shadow.camera.near = 10;
        // this.scene.add(spotLight);
        // this.scene.add(new THREE.SpotLightHelper(spotLight, "red"));

        var light1 = new THREE.DirectionalLight(0xFFFFFF);
        light1.position.set(-40, 40, -15);
        light1.position.copy(this.camera.position);
        light1.position.x = -light1.position.x;
        light1.castShadow = true;
        light1.shadow.mapSize = new THREE.Vector2(1024 * 5, 1024 * 5);
        light1.shadow.camera.far = 2000;
        light1.shadow.camera.near = .5;
        var c = 1000;
        light1.shadow.camera.left = -c;
        light1.shadow.camera.bottom = -c;
        light1.shadow.camera.right = c;
        light1.shadow.camera.top = c;

        light1.shadow.camera.position.copy(light1.position);
        light1.shadow.camera.lookAt(new THREE.Vector3());
        this.scene.add(light1);
        this.scene.add(new THREE.DirectionalLightHelper(light1, 50, "red"));
        this.scene.add(new THREE.CameraHelper(light1.shadow.camera));

        // var light3 = new THREE.AmbientLight(0x222222);
        // this.scene.add(light3);

        this.controls.target.copy(this.sample.position);
    }

    private onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private run() {

        // this.sample.rotation.x += 0.02;
        // this.sample.rotation.y += 0.02;

        this.controls.update();
        this.render();
        requestAnimationFrame(this.run);
    }

    private render() {

        this.renderer.render(this.scene, this.camera);
    }
}

var app = new App();
