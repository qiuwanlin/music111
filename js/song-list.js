{
    let view = {
        el: '.songList-container',
        template: `
             <ul class="songList">
                    </ul>`,
        render(data) {
            
            let { songs } = data
            let liList = songs.map((song) => $('<li></li>').text(song.name))
            let $el = $(this.el)
            $el.find('ul').empty()
            liList.map((d) => {
                $el.find('ul').append(d)
            })
        }
    }
    let model = {
        data:{
            songs:[]
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('create',(songData)=>{
                //console.log(songData)
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            }
            )}
    }
    controller.init(view, model)
}