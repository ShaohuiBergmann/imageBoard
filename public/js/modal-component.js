import commentsComponent from "./comments-component.js";

const modalComponent = {
    data() {
        return {
            image: {},
        };
    },

    components: {
        "comments-component": commentsComponent,
    },

    props: ["trackId"],
    mounted() {
        console.log("first component");
        console.log("selected image", this.trackId);
        fetch(`/upload/${this.trackId}`)
            .then((res) => res.json())
            .then((data) => {
                this.image = data;
            })
            .catch((err) => {
                console.log("Error at /upload/id", err);
            });
    },
    methods: {
        closeModal() {
            console.log("close running in modal componenet");
            this.$emit("close");
        },
    },
    template: `
         <section id="imageContainer"> 
         <span @click="closeModal" class="close">&times;</span>
         <img v-if="image.url" :src="image.url" alt="Loading" :key="image.id" >
         <h3 v-else="!image.url">Image not found.</h3>
         <h3 v-if="image.url"> Username: {{image.username}} </h3>
         <h4 v-if="image.url">Title: {{image.title}}</h4>
         <p v-if="image.url">Description: {{image.description}}</p>
         <comments-component v-if="image.url" :track-id="trackId"></comments-component>
         </section> 
         `,
};

export default modalComponent;
