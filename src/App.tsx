import { createVNode, defineComponent, onUnmounted, ref } from "vue";
import { popup } from "@/components/Popup";
import { Button } from "ant-design-vue";

const Content = defineComponent({
  setup() {
    return () => {
      return <span>弹窗内容</span>;
    };
  },
});

export default defineComponent({
  setup() {
    const { vueRender } = popup();

    const modalRef = ref();

    const onOpen = () => {
      modalRef.value = vueRender({
        only: "1",
        title: "弹窗示例",
        className: "flex flex-col",
        popupClass: "h-[937px] w-[1200px]",
        vNode: createVNode(Content),
      });
    };

    onUnmounted(() => {
      modalRef.value?.closeAll();
    });

    return () => {
      return <Button type="primary" onClick={onOpen}>打开弹窗</Button>;
    };
  },
});
