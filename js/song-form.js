{
    let view = {
        el: '.page > main',
        template: `
            <form class="form">
                    <div class="row">
                        <label for="">歌名:</label>
                        <input name="name" type="text" value="__name__">
                        
                    </div>
                    <div class="row">
                        <label for="">歌手:</label>
                        <input name="singer" type="text" value="__singer__">
                        
                    </div>
                    <div class="row">
                        <label for="">外链:
                        <input name="url" type="text" >
                        </label>
                    </div>
                    <div class="row">
                        <button type="submit">保存</button>
                    </div>
                </form>`,
        render(data = {}) {
            let ppp = ['name', 'url', 'singer', 'id']
            let html = this.template
            ppp.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            } else {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        init() {
            this.$el = $(this.el)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: '',
        },
        create(data) {
            var TestObject = AV.Object.extend('song');
            var Song = new TestObject();
            Song.set('name', data.name);
            Song.set('singer', data.singer);
            Song.set('url', data.url);

            return Song.save().then((song) => {
                let { id, attributes } = song
                Object.assign(this.data, { id, ...attributes })
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvent()
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', () => {
                this.model.data = {
                    name: '', singer: '', url: '', id: ''
                }
                this.view.render(this.model.data)
            })
        },
        bindEvent() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data).then(() => {
                    this.view.reset()
                    let data = JSON.stringify(this.model.data)
                    window.eventHub.emit('create', JSON.parse(data))
                })
            })


        }
    }
    controller.init(view, model)
}