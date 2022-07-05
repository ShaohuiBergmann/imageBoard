import * as Vue from "./vue.js";
import modalComponent from "./modal-component.js";

Vue.createApp({
    data() {
        return {
            visible: true,
            images: [],
            selectedImage: null,
            lowestId: null,
            moreImages: true,
        };
    }, // data ends here
    //  here to ask if there is any pics in the database to retrive
    // it runs  automaticly everytime when the content in the vue app runs
    components: {
        "modal-component": modalComponent,
    },

    mounted() {
        console.log("my vue app is mounted");
        fetch("/images")
            .then((res) => res.json())
            .then((data) => {
                this.images = data;
            });

        if (parseInt(location.pathname.slice(1))) {
            this.selectedImage = location.pathname.slice(1);
        } else {
            history.pushState({}, "", "/");
        }

        window.addEventListener("popstate", () => {
            this.selectedImage = location.pathname.slice(1);
        });
    },

    methods: {
        // this is where we define our functions
        // stay in the same route
        handleSubmit(e) {
            e.preventDefault();
            console.log("handle submit");
            fetch("/upload", {
                method: "POST",
                body: new FormData(e.target),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("data", data);
                    this.images.unshift(data[0]);
                });
        }, // end of handlesubmit

        trackId(id) {
            console.log("this id is clicked", id);
            this.selectedImage = id;
            history.pushState({}, "", `/${id}`);
        },
        closeImg() {
            console.log("first emit");
            this.selectedImage = null;
            history.pushState({}, "", "/");
        },
        moreImg() {
            this.lowestId = this.images[this.images.length - 1].id;
            fetch("/more/" + this.lowestId)
                .then((result) => {
                    return result.json();
                })
                .then((data) => {
                    console.log("moreImg", data);
                    data.forEach((el) => {
                        el.id === el.lowestId
                            ? (this.moreImages = false)
                            : (this.moreImages = true);
                        this.images.push(el);
                    });
                    this.lowestId = this.images[this.images.length - 1].id;
                })
                .catch((err) => {
                    console.log("Err at moreImg", err);
                });
        },
    },
}).mount("#main");
