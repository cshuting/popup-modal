import { ref, nextTick } from 'vue';

export default function usePopup(idNum: number, isHave: Record<string, any>) {
    const maxResizeTop = ref();
    const maxResizeLeft = ref();
    const maxResizeHeight = ref();
    const maxResizeWidth = ref();

    const changebox = ref();
    //获取弹窗
    const bt = ref();
    const title = ref();
    const popup = ref();
    //   const popupBg = ref();
    const big = ref();
    const close = ref();

    const isBigFlag = ref(false);

    nextTick(() => {
        changebox.value = document.querySelector(`.changebox${idNum}`) as HTMLElement;

        //获取改变大小边缘的父级盒子
        bt.value = document.querySelector(`.bt${idNum}`) as HTMLElement;
        title.value = document.querySelector(`.title${idNum}`) as HTMLElement;
        popup.value = document.querySelector(`.popup${idNum}`) as HTMLElement;
        // popupBg.value = document.querySelector(`.popup-bg`) as HTMLElement;
        big.value = document.querySelector(`.big${idNum}`) as HTMLElement;
        close.value = document.querySelector(`.close${idNum}`) as HTMLElement;

        let isDrag = false, //拖动标志
            isResize = false, //改变大小标志
            isBig = false;

        let leftbox: number,
            topbox: number,
            beforeX: number,
            beforeY: number,
            beforeHeight: number,
            beforeWidth: number,
            nowX,
            nowY,
            maxLeft: number,
            maxTop: number,
            switchDirection: any,
            width: string | number,
            height: string | number,
            top: string | number,
            left: string | number,
            orginal: { top: string; height: string; width: string; left: string };

        popup.value.style.left =
            (document.documentElement.clientWidth - popup.value.offsetWidth) / 2 + 'px';

        popup.value.style.top =
            (document.documentElement.clientHeight - popup.value.offsetHeight) / 2 + 'px';

        //最大化按钮
        big.value.addEventListener('click', function () {
            if (isBig) {
                //恢复最大化前的位置和大小
                popup.value.style.top = orginal.top;
                popup.value.style.height = orginal.height;
                popup.value.style.width = orginal.width;
                popup.value.style.left = orginal.left;
            } else {
                //储存最大化前的位置和大小
                orginal = {
                    left: popup.value.offsetLeft + 'px',
                    top: popup.value.offsetTop + 'px',
                    height: popup.value.clientHeight + 'px',
                    width: popup.value.clientWidth + 'px',
                };
                popup.value.style.left = '0';
                popup.value.style.top = '0';
                popup.value.style.height = document.documentElement.clientHeight - 2 + 'px';
                popup.value.style.width = document.documentElement.clientWidth - 2 + 'px';
            }
            isBig = !isBig;

            isBigFlag.value = isBig;
        });

        //鼠标按下选中弹窗标题变为可拖动,同时获取鼠标据弹窗左和上的距离及可拖动的最大距离
        title.value.addEventListener('mousedown', function (e: MouseEvent) {
            e = e || window.event;
            maxTop = document.documentElement.clientHeight - popup.value.offsetHeight;
            maxLeft = document.documentElement.clientWidth - popup.value.offsetWidth;
            topbox = e.pageY - popup.value.offsetTop;
            leftbox = e.pageX - popup.value.offsetLeft;
            isDrag = true;

            //阻止事件默认行为和事件冒泡
            document.addEventListener('mousemove', pauseEvent);
        });

        //鼠标移动时改变大小或拖动弹窗
        document.addEventListener('mousemove', function (e) {
            e = e || window.event;
            //获取鼠标移动时的位置
            nowX = e.pageX;
            nowY = e.pageY;
            //拖动时
            if (isDrag) {
                left = nowX - leftbox;
                top = nowY - topbox > 0 ? nowY - topbox : 0;

                //设置弹窗位置
                popup.value.style.left = left + 'px';
                popup.value.style.top = top + 'px';
            }

            //改变大小时
            if (isResize) {
                switch (switchDirection) {
                    case 'top':
                        top = nowY;
                        height = beforeY - nowY + beforeHeight - topbox;
                        break;
                    case 'left':
                        left = nowX;
                        width = beforeX - nowX + beforeWidth - leftbox;
                        break;
                    case 'bottom':
                        height = nowY - beforeY + beforeHeight;
                        break;
                    case 'right':
                        width = nowX - beforeX + beforeWidth;
                        break;
                    case 'top-left':
                        top = nowY;
                        left = nowX;
                        width = beforeX - nowX + beforeWidth - leftbox;
                        height = beforeY - nowY + beforeHeight - topbox;
                        break;
                    case 'left-bottom':
                        left = nowX;
                        width = beforeX - nowX + beforeWidth - leftbox;
                        height = nowY - beforeY + beforeHeight;
                        break;
                    case 'bottom-right':
                        width = nowX - beforeX + beforeWidth;
                        height = nowY - beforeY + beforeHeight;
                        break;
                    case 'right-top':
                        top = nowY;
                        width = nowX - beforeX + beforeWidth;
                        height = beforeY - nowY + beforeHeight - topbox;
                        break;
                }

                //弹窗范围限制
                // left = left < 0 ? 0 : left;
                // top = top < 0 ? 0 : top;
                // left = left > maxLeft ? maxLeft : left;
                // top = top > maxTop ? maxTop : top;

                //设置最小宽高
                height = height < 100 ? 100 : height;
                width = width < 100 ? 100 : width;

                //设置最大宽高
                top = top > maxResizeTop.value ? maxResizeTop.value : top;
                left = left > maxResizeLeft.value ? maxResizeLeft.value : left;
                height = height > maxResizeHeight.value ? maxResizeHeight.value : height;
                width = width > maxResizeWidth.value ? maxResizeWidth.value : width;

                //设置宽高
                popup.value.style.top = top + 'px';
                popup.value.style.left = left + 'px';
                popup.value.style.width = width + 'px';
                popup.value.style.height = height + 'px';

                //设置拖拽改变弹窗的范围限制
                maxLeft = window.innerWidth - popup.value.offsetWidth;
                maxTop = window.innerHeight - popup.value.offsetHeight;
            }
        });

        //鼠标松开,变为不可拖动和拖拽改变大小
        document.addEventListener('mouseup', function () {
            isDrag = false;
            isResize = false;

            document.removeEventListener('mousemove', pauseEvent);
        });

        // 使用事件代理为边框上的添加监听
        changebox.value.addEventListener('mousedown', function (e: MouseEvent) {
            e = e || window.event;

            //阻止事件默认行为和事件冒泡
            document.addEventListener('mousemove', pauseEvent);
            //获取改变大小前的鼠标位置和弹窗宽高
            if (e.target) {
                beforeX = e.pageX;
                beforeY = e.pageY;
                beforeHeight = popup.value.clientHeight;
                beforeWidth = popup.value.clientWidth;
                //获取选中方向类名
                switchDirection = (e.target as Element).classList[0];
                //获取鼠标距离边缘的距离
                leftbox = e.pageX - popup.value.offsetLeft;
                topbox = e.pageY - popup.value.offsetTop;
                //改变大小时的最大范围，50为设置的最小弹窗大小，2为2倍边框宽度
                maxResizeTop.value = popup.value.offsetTop + popup.value.clientHeight - 100;
                maxResizeLeft.value = popup.value.offsetLeft + popup.value.clientWidth - 100;
                maxResizeHeight.value = popup.value.offsetTop + popup.value.clientHeight - 2;
                maxResizeWidth.value = popup.value.offsetLeft + popup.value.clientWidth - 2;
                isResize = true;
                //根据拖拽不同方向设置不同的最大弹窗大小
                switch (switchDirection) {
                    case 'top':
                        break;
                    case 'left':
                        break;
                    case 'bottom':
                        maxResizeHeight.value =
                            document.documentElement.clientHeight - popup.value.offsetTop - 2;
                        break;
                    case 'right':
                        maxResizeWidth.value =
                            document.documentElement.clientWidth - popup.value.offsetLeft - 2;
                        break;
                    case 'top-left':
                        break;
                    case 'left-bottom':
                        maxResizeHeight.value =
                            document.documentElement.clientHeight - popup.value.offsetTop - 2;
                        break;
                    case 'bottom-right':
                        maxResizeWidth.value =
                            document.documentElement.clientWidth - popup.value.offsetLeft - 2;
                        maxResizeHeight.value =
                            document.documentElement.clientHeight - popup.value.offsetTop - 2;
                        break;
                    case 'right-top':
                        maxResizeWidth.value =
                            document.documentElement.clientWidth - popup.value.offsetLeft - 2;
                        break;
                }
            }
        });

        const boxTop = () => {
            const popupList = document.querySelectorAll('.popup');

            let maxZi = 0;

            for (let i = 0; i < popupList.length; i++) {
                const targetZi = Number(getComputedStyle(popupList[i]).getPropertyValue('z-index'));
                maxZi = targetZi > maxZi ? targetZi : maxZi;
            }
            const nowMaxZi = maxZi + 1;

            popup.value.style.zIndex = nowMaxZi;

            isHave['z-index'] = nowMaxZi;
        };

        boxTop();

        // 点击弹窗置顶
        popup.value.addEventListener('mousedown', boxTop);

        //阻止默认行为和事件冒泡，缺少会导致误触发drag事件，使得mouseup失效
        function pauseEvent(e: MouseEvent) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        }
    });

    return {
        isBigFlag,
    };
}
