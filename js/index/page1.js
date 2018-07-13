{
    let view = {
        el: '.page-1',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
            this.loadmodule1()
            this.loadmodule2()
        },
        bindEventHub() {
            window.eventHub.on('selectTab', (tabname) => {
                if (tabname === 'page-1') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        },
        loadmodule1() {
            let script1 = document.createElement('script')
            script1.src = './js/index/page1-1.js'
            script1.onload = function () {
                console.log('mokuai1 ok')
            }
            document.body.appendChild(script1)
        },
        loadmodule2() {
            let script2 = document.createElement('script')
            script2.src = './js/index/page1-2.js'
            script2.onload = function () {
                console.log('mokuai2 ok')
            }
            document.body.appendChild(script2)
        }
    }
    controller.init(view, model)
}