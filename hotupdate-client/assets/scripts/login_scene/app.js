
cc.Class({
    extends: cc.Component,

    properties: {
        lbl_app: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.lbl_app.string = "这是热更测试代码";
    }
});
