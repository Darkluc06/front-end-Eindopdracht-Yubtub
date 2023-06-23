class GetData {
    url;
    data = null;
    constructor(newUrl) {
        this.url = newUrl;
    }
    async getJson() {
        await fetch(this.url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.data = data.videos;
            });
        return this.data;
    }
}

class App {
    switcher;
    api;
    constructor() {
        this.api = new GetData("../data/data.json")
        this.api.getJson().then((data) => {
            this.switcher = new Switcher(this, data);

        });
    }
}

class Switcher {
    yubtub;
    cleaner;
    app;
    default = 0;

    constructor(app, data) {
        this.app = app;
        this.data = data;
        this.yubtub = new Yubtub(this.app, data, this.default);
        this.cleaner = new Cleaner();
    }

    switch(link) {
        this.cleaner.clean("body");
        this.yubtub = new Yubtub(this.app, this.data, this.data[link].id);
    }
}

class Cleaner {
    clean(whereToClean) {
        document.querySelector(whereToClean).innerHTML = "";
    }
}

class Yubtub {
    aside;
    renderer;
    app;
    default;
    main;
    header;
    constructor(app, data, base) {
        this.app = app;
        this.default = base;
        this.renderer = new Renderer();
        this.header = new Header(this);
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === base) {
                this.main = new Main(this, data[i]);
            }
        }
        this.aside = new Aside(this, data, this.default);
        this.footer = new Footer(this);
    }
}


class Header{
    htmlElement
    yubtub;
    title
    constructor(yubtub){
        this.yubtub = yubtub
        this.htmlElement = document.createElement("header");
        this.htmlElement.classList.add("header");

        this.title = document.createElement("h1");
        this.title.classList.add("header__title")
        this.title.innerText = "Yubtub"
        

        this.yubtub.renderer.render("body", this.htmlElement);
        this.yubtub.renderer.render(".header", this.title)
    }
}

class Footer{
    htmlElement
    yubtub;
    constructor(yubtub){
        this.yubtub = yubtub
        this.htmlElement = document.createElement("footer");
        this.htmlElement.classList.add("footer");
        this.yubtub.renderer.render("body", this.htmlElement);
    }
}

class Main {
    htmlElement;
    yubtub;
    data;
    video;
    comments;
    yubtubSection
    constructor(yubtub, data) {
        this.yubtub = yubtub;
        this.data = data;
        this.htmlElement = document.createElement("main");
        this.htmlElement.classList.add("yubtub");

        this.yubtubSection = document.createElement("section");
        this.yubtubSection.classList.add("yubtub__section");

        this.yubtub.renderer.render("body", this.htmlElement);
        this.yubtub.renderer.render(".yubtub", this.yubtubSection)
        this.video = new Video(this.data.video, this.yubtub);
        this.comments = new Comments(this, this.data.comments);
    }
}

class Video {
    htmlElement;
    htmlElementVideo;
    video;
    yubtub;
    constructor(video, yubtub) {
        this.video = video;
        this.yubtub = yubtub;
        this.htmlElement = document.createElement("figure");
        this.htmlElement.classList.add("yubtub__figure");
        this.htmlElementVideo = document.createElement("video");
        this.htmlElementVideo.classList.add("yubtub__video");
        this.htmlElementVideo.setAttribute("controls", "controls");
        this.htmlElementVideo.setAttribute("disablepictureinpicture", "true");
        this.htmlElementVideo.setAttribute("muted", "true");
        this.htmlElementVideo.src = this.video;
        this.yubtub.renderer.render(".yubtub__section", this.htmlElement);
        this.yubtub.renderer.render(".yubtub__figure", this.htmlElementVideo);
    }
}

class Comments {
    htmlElement;
    main;
    comments;
    comment;
    constructor(main, comments) {
        this.main = main;
        this.comments = comments;
        this.htmlElement = document.createElement("ul");
        this.htmlElement.classList.add("yubtub__comments");
        this.main.yubtub.renderer.render(".yubtub__section", this.htmlElement);
        for (let i = 0; i < comments.length; i++) {
            this.makeComments(this.comments[i], i);
        }
        this.comment = new Comment(this)
        
    }

    makeComments(comments, i) {
        let div = document.createElement("div");
        div.classList.add("yubtub__avatarDiv")
        
        let avatar = document.createElement("i");
        avatar.classList.add("yubtub__avatar");
        avatar.classList.add("fa-solid");
        avatar.classList.add("fa-user");
        
        let comment = document.createElement("li");
        comment.classList.add("yubtub__comment");

        let commentSection = document.createElement("section");
        commentSection.classList.add("yubtub__commentSection");
        commentSection.setAttribute("id", `section__${i}`)


        let commentText = document.createElement("p");
        commentText.classList.add("yubtub__commentText");
        commentText.innerText = comments;

        this.main.yubtub.renderer.render(".yubtub__comments", comment);
        this.main.yubtub.renderer.renderChild(".yubtub__comments", avatar, i); 
        this.main.yubtub.renderer.renderChild(".yubtub__comments", commentSection, i); 
        this.main.yubtub.renderer.render(`#section__${i}`, commentText);   
    }
}

class Comment{
    comments;
    createComment
    constructor(comments){
        this.comments = comments;
        this.createComment = document.createElement("section");
        this.createComment.classList.add("yubtub__createComment");

        this.createCommentSection = document.createElement("section");
        this.createCommentSection.classList.add("yubtub__createCommentSection");

        this.createCommentInput = document.createElement("textarea");
        this.createCommentInput.classList.add("yubtub__createCommentInput")
        this.createCommentInput.setAttribute("placeholder", "type your comment here")



        this.comments.main.yubtub.renderer.render(".yubtub__section", this.createComment);
        this.comments.main.yubtub.renderer.render(".yubtub__createComment", this.createCommentSection);
        this.comments.main.yubtub.renderer.render(".yubtub__createCommentSection", this.createCommentInput);
        this.createCommentInput.addEventListener("keyup", (event) => {
            if (event.code === "Enter") {
              this.submit();
            }
        });      
    }

    submit = () =>{
        let text = this.createCommentInput.value
        this.comments.comments.push(text)
        let i = this.comments.comments.length
        i = i -1
        this.comments.makeComments(this.comments.comments[i], i)
        this.createCommentInput.value = ""
        console.log(this.comments.comments)
    }
}

class Renderer {
    render(whereToRender, whatToRender) {
        document.querySelector(whereToRender).appendChild(whatToRender);
    }
    renderChild(whereToRender, whatToRender, i){
        parent = document.querySelector(whereToRender);
        parent.children[i].appendChild(whatToRender);
    }
}

class Aside {
    yubtub;
    nextVideo;
    htmlElement;
    default

    constructor(yubtub, data, base) {
        this.yubtub = yubtub;
        this.default = base;
        this.htmlElement = document.createElement("aside");
        this.htmlElement.classList.add("yubtub__aside");
        this.yubtub.renderer.render(".yubtub", this.htmlElement);
        for (let i = 0; i < data.length; i++) {
            if (data[i].id != base) {
                this.nextVideo = new NextVideo(this, data[i]);
            }
        }
    }
}

class NextVideo {
    aside;
    htmlElement;
    constructor(aside, data) {
        this.aside = aside;
        this.data = data;
        this.htmlElement = document.createElement("video");
        this.htmlElement.setAttribute("disablepictureinpicture", "true");
        this.htmlElement.classList.add("yubtub__asideVideo");
        this.htmlElement.src = data.video;
        this.aside.yubtub.renderer.render("aside", this.htmlElement);
        this.htmlElement.onclick = this.videoClicked;
    }

    videoClicked = () => {
        this.aside.yubtub.app.switcher.switch(this.data.id);
    }
}

const app = new App();