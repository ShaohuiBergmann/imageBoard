import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            visible: true,
            images: [],
        };
    }, // data ends here
    //  here to ask if there is any pics in the database to retrive
    // it runs  automaticly everytime when the content in the vue app runs
    mounted() {
        console.log("my vue app is mounted");
        fetch("/images")
            .then((res) => res.json())
            .then((data) => {
                this.images = data;
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
                body: new FormData(e.target)
            })
            .then((res) => res.json())
            .then((data) => console.log(data))
        }
    },
}).mount("#main");
