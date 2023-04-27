import { Ref, nextTick } from 'vue';

interface Option {
    ele: Ref;
    isHave: Record<string, any>;
    only: string;
}

export default function usePosition({ ele, isHave, only }: Option) {
    // 元素的样式集合
    nextTick(() => {
        // 获得元素的所有style
        const style = window.getComputedStyle(ele.value);

        isHave[only].position = {
            top: style.top,
            left: style.left,
        };
    });

    return {};
}
