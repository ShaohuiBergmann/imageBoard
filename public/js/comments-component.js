const commentsComponent = {
    data() {
        return {
            comments: [],
            comment: "",
            username: "",
        };
    },
    props: ["trackId"],

    mounted() {
        fetch(`/comments/${this.trackId}`)
            .then((res) => res.json())
            .then((data) => {
                
                this.comments = data;
            })
            .catch((err) => {
                "Err  at fetching comments", err;
            });
    },
    methods: {
        sendComments() {
            fetch("/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_id: this.trackId,
                    comment: this.comment,
                    username: this.username,
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    // console.log("fetch comments", data);
                    this.comments.unshift(data);
                });
        },
    },

    template: `<form method="POST" id="commentsContainer" action="/comment">
        <h6>Add a Comment!</h6>
         <label>Comment</label>
         <input v-model="comment" name="comment" placeholder="write your comments here" required>
         <label>Username</label>
         <input v-model="username" name="username" placeholder="Username" required>
         <button @click.prevent="sendComments" type="submit">Submit</button>
         </form>
         <div class="comments" v-for="comment in comments">
         <h4>{{comment.username}}: {{comment.comment}}</h4>
         <p>commented at: {{comment.created_at}}</p>
         </div>`,
};

export default commentsComponent;
