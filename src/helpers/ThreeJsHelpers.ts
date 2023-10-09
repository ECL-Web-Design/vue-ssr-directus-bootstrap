import {
    Color,
    ColorManagement,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    Vector2,
    VSMShadowMap,
    WebGLRenderer,
} from "three"

export function useSceneEssentials(canvasEl: HTMLCanvasElement, width: number, height: number) {
    const scene = new Scene()
    const camera = new PerspectiveCamera(
        40,
        width / height
    )
    const renderer = new WebGLRenderer({canvas: canvasEl, antialias: true, alpha: true})
    // @ts-ignore
    ColorManagement.enabled = false
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = VSMShadowMap
    renderer.outputEncoding = sRGBEncoding
    //renderer.toneMapping = NoToneMapping
    renderer.setPixelRatio(1)
    renderer.setSize(width, height)
    camera.position.set(0, 0, 1)

    renderer.setClearAlpha(0)
    renderer.setClearColor(0xffffff, 0)

    return {scene: scene, camera: camera, renderer: renderer}
}

export function visibleHeightAtZDepth(
    depth: number,
    camera: PerspectiveCamera
) {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z
    if (depth < cameraOffset) {
        depth -= cameraOffset
    } else {
        depth += cameraOffset
    }

    // vertical fov in radians
    const vFOV = (camera.fov * Math.PI) / 180

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
}

export function visibleWidthAtZDepth(depth: number, camera: PerspectiveCamera) {
    const height = visibleHeightAtZDepth(depth, camera)
    return height * camera.aspect
}

export function getScreenCorrectedColorHex(hexColor: string) {
    return (new Color(hexColor)).offsetHSL(0, 0, -0.013)//-0.013
}

export function getScreenCorrectedColor(col: Color) {
    return col.offsetHSL(0, 0, -0.013) //0.013
}

function clamp(val: number, min: number, max: number) {
    return Math.min(max, Math.max(min, val))
}

interface Line2D {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}

// export function distanceAlongLineFromPoint(line: Line2D, pointX: number, pointY: number) {
//
//     dummyLineStartOrig.set(line.x1, line.y1)
//     dummyLineStart.set(line.x1, line.y1)
//     dummyLineEnd.set(line.x2, line.y2)
//     dummyPoint.set(pointX, pointY)
//
//     const lineLength = dummyLineStart.distanceTo(dummyLineEnd)
//
//     const dotDiff = dummyPoint.sub(dummyLineStart).dot(dummyLineEnd) / dummyLineEnd.dot(dummyLineEnd)
//
//
//     const pointIntersect = dummyLineStart.add(dummyLineEnd)
//                                          .multiplyScalar(dotDiff)
//                                          .clamp(dummyLineStartOrig, dummyLineEnd)
//
//     return pointIntersect.distanceTo(dummyLineStartOrig) / lineLength
// }


const dummyLineStart = new Vector2(0, 0)
const dummyLineEnd = new Vector2(0, 0)
const dummyPoint = new Vector2(0, 0)
const dummyLineEndTranslated = new Vector2(0, 0)

//provides an interpolation value between 0 and 1 for a point depending on its relative parallel position to a line
//points before the start of the line will return 1
export function interpolatePointValueAlongLine(
    line: Line2D,
    pointX: number,
    pointY: number
) {

    //use reusable vecs to prevent reinitialising class every call
    dummyLineStart.set(line.x1, line.y1)
    dummyLineEnd.set(line.x2, line.y2)
    dummyPoint.set(pointX, pointY)

    //code from: https://www.shadertoy.com/view/lscGDr
    dummyLineEndTranslated.set(line.x2, line.y2)
                          .sub(dummyLineStart)

    return dummyPoint.sub(dummyLineStart)
                     .dot(dummyLineEndTranslated) / dummyLineEndTranslated.dot(dummyLineEndTranslated)
}
