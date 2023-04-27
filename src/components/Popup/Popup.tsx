import { defineComponent, ref } from "vue";
import "./popup.less";
import usePopup from "./usePopup";
import usePosition from "./usePosition";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  props: {
    // 用于生成不同的类名，确保唯一性
    idNum: {
      type: Number,
      default: 0,
    },
    // 弹窗的唯一存在标识，配合isHave使用
    only: {
      type: String,
      default: "",
    },
    // 弹窗存在的属性值
    isHave: {
      type: Object,
      default: () => {},
    },
    // 点击次数，用于监听是否重复点击弹窗触发按钮
    clickNum: {
      type: Number,
      default: 0,
    },
    vh: {
      type: Object,
    },
    title: {
      type: String,
      default: "标题",
    },
    close: {
      type: Function,
      default: () => {},
    },
    className: {
      type: String,
      default: "",
    },
    popupClass: {
      type: String,
      default: "w-auto h-[800px]",
    },
  },
  setup(props) {
    const popup = ref();
    const { isBigFlag } = usePopup(props.idNum, props.isHave);

    usePosition({
      ele: popup,
      isHave: props.isHave,
      only: props.only,
    });

    return () => {
      return (
        <div
          ref={popup}
          class={["popup", `popup${props.idNum}`, props.popupClass]}
        >
          <div class={["title", `title${props.idNum}`]}>
            <span class={"title_text"}>{props.title}</span>
            <div class={"title_btn"}>
              <span class={["big", `big${props.idNum}`]}>
                {isBigFlag.value ? (
                  <FullscreenExitOutlined></FullscreenExitOutlined>
                ) : (
                  <FullscreenOutlined></FullscreenOutlined>
                )}
              </span>
              <span
                class={["close", `close${props.idNum}`]}
                onClick={() => {
                  props.close();
                }}
              >
                <CloseOutlined />
              </span>
            </div>
          </div>
          <div class={"title_shadow"}></div>
          <div class={["content", props.className]}>
            {/* <div>{props.vh ?? '内容'}</div> */}
            {props.vh ?? "内容"}
          </div>
          <div class={["changebox", `changebox${props.idNum}`]}>
            <div class={["top", `top${props.idNum}`]}></div>
            <div class={["top-left", `top-left${props.idNum}`]}></div>
            <div class={["left", `left${props.idNum}`]}></div>
            <div class={["left-bottom", `left-bottom${props.idNum}`]}></div>
            <div class={["bottom", `bottom${props.idNum}`]}></div>
            <div class={["bottom-right", `bottom-right${props.idNum}`]}></div>
            <div class={["right", `right${props.idNum}`]}></div>
            <div class={["right-top", `right-top${props.idNum}`]}></div>
          </div>
        </div>
      );
    };
  },
});
