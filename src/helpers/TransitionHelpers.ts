interface KeepTransitionPositionOptions {
    forcedHeight?: string,
    offsetByScroll?: boolean
}

export function keepPositionLeave(el: HTMLElement, options: KeepTransitionPositionOptions = {}) {
    const {
        marginLeft,
        marginTop,
        width,
        height
    } = window.getComputedStyle(el)

    el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`
    el.style.top = `${el.offsetTop -
                      parseFloat(marginTop) -
                      (options?.offsetByScroll ? window.scrollY : 0)}px`
    el.style.width = width
    el.style.height = options?.forcedHeight ?? height
}
