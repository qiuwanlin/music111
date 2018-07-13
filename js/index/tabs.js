{
    let view = {
        el: '#tabs',
        init() {
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents() {
            this.view.$el.on('click', '.tabs-nav>li', (e) => {
                let $li = $(e.currentTarget)
                let tabname = $li.attr('tab-name')
                $li.addClass('active').siblings().removeClass('active')
                window.eventHub.emit('selectTab',tabname)
            })
        }
    }
    controller.init(view,model)
}