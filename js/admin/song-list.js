{
    let view = {
        el: '.songList-container',
        template: `
             <ul class="songList">
                    </ul>`,
        render(data) {
            let { songs, selectId } = data
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('data-id', song.id)
                if (song.id === selectId) { $li.addClass('active') }
                return $li
            })
            let $el = $(this.el)
            $el.find('ul').empty()
            liList.map((d) => {
                $el.find('ul').append(d)
            })
        },
    
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectId: null,
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
                let songId = e.currentTarget.getAttribute('data-id')
                this.model.data.selectId =songId
                this.view.render(this.model.data)
                let data
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === songId) {
                        data = songs[i]
                        break
                    }
                }
                let object = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('select', object)
            })
        },
        bindEventHub() {
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', () => {
                this.view.clearActive()
            })
            window.eventHub.on('update', (song) => {
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === song.id) {
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }

    controller.init(view, model)
}