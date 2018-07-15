{
    let view = {}
    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: ''
        },
        get() {
            var query = new AV.Query('song')
            return query.get(id).then((song)=> {
                Object.assign(this.data,{id:song.id,...song.attributes})
               return song
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getsongId()
            this.model.get().then(()=>{
                console.log(this.model.data)
            })
        },
        getsongId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let array = search.split('&').filter((a => a))
            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view, model)
}