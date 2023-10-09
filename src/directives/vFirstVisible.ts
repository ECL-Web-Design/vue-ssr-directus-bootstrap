import {useIntersectionObserver} from "@vueuse/core"
import type {Directive} from "vue"

interface FirstVisibleOptions {
    cb: () => void,
    threshold?: number,
    margin?: string
}

const vFirstVisible: Directive<HTMLElement, FirstVisibleOptions> = {
    mounted: (el: HTMLElement, {value: {cb: callback, margin, threshold}}) => {
        const {stop: stopObserver} = useIntersectionObserver(
            el,
            ([{isIntersecting}]) => {
                if (isIntersecting) {
                    callback()
                    stopObserver()
                }
            }, {
                threshold: threshold,
                rootMargin: margin
            }
        )
    }
}

export default vFirstVisible
