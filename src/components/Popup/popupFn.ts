import { render, createVNode, reactive } from 'vue';
import Popup from './Popup';

interface Option {
    only: string;
    [x: string]: any;
}

/**
 * 生成弹窗
 *
 */
function popup() {
    // 该弹窗是否存在
    const isHave = reactive<Record<string, any>>({});

    const vueRender = (option: Option) => {
        // only 弹窗唯一标识
        const { only, vNode, title, className, popupClass } = option;

        // const

        if (isHave[only]) {
            isHave['z-index'] = isHave['z-index'] + 1;
            isHave[only].el.setAttribute(
                'style',
                `top:${isHave[only].position.top};left:${isHave[only].position.left};z-index:${isHave['z-index']}`
            );
            // return;
        } else {
            isHave[only] = {
                [only]: true,
                position: {},
                el: null,
            };

            // 创建一个新的空白的文档片段
            const container = document.createDocumentFragment();

            // 关闭该弹窗
            const close = () => {
                isHave[only].el.remove();
                isHave[only] = false;
            };

            // 创建虚拟DOM
            const vm = createVNode(Popup, {
                idNum: Date.now(),
                isHave: isHave,
                only: only,
                vh: vNode,
                title: title,
                close: close,
                className,
                popupClass,
            });

            // render函数生成真实DOM
            render(vm, container as any);

            isHave[only].el = vm.el;

            // 在body下依次添加DOM
            document.body.appendChild(vm.el as Node);
        }

        // 关闭所有弹窗
        const closeAll = () => {
            // console.log(isHave, 'isHave');

            Object.keys(isHave).forEach(item => {
                // console.log(item);
                // console.log(isHave[item]);

                isHave[item]?.el?.remove();
                isHave[item] = false;
            });
        };

        return {
            // close,
            closeAll,
        };
    };

    return {
        vueRender,
    };
}

export { popup };
