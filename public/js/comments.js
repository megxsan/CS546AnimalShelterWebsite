(function($){
    let commentForm = $('#comment-form'),
    comment = $('#commentInput');

    commentForm.submit(function (event) {

        event.preventDefault();
        let newComment = comment.val();
        if(newComment.val().trim() == ''){

        }
        if(newComment){
            // let requestConfig = {
            //     method: 'POST',
            //     url: 
            //     data: JSON.stringify({
            //         comment: newComment
            //     })
            // }
        };

        $.ajax(requestConfig).then
    })

})(window.jQuery);