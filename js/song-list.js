{
    let view = {
        el: '.songList-container',
        template: `
             <ul class="songList">
                    </ul>`,
        render(data) {

            let { songs } = data
            let liList = songs.map((song) => {
                return $('<li></li>').text(song.name).attr('data-id', song.id)
            })
            let $el = $(this.el)
            $el.find('ul').empty()
            liList.map((d) => {
                $el.find('ul').append(d)
            })
        },
        activeItem(li) {
            let $li = $(li)
            $li.addClass('active').siblings('.active').removeClass('active')
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.getAllSongs()
            this.bindEvents()
            this.bindEventHub()
            
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-id')
                let data
                let songs = this.model.data.songs
                for(let i =0;i<songs.length;i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                let object = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('select', object)
            })
        },
        bindEventHub(){
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
        }
    }

controller.init(view, model)
}