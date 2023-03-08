$(function(){
    $(".navbar-toggler-icon").click(function(){
        $("#collapsibleNavbar").toggle()
    })
    $(".mode").click(function(){
        $("#night").toggleClass()
        $(this).toggleClass("bi bi-brightness-high")
        $("nav").toggleClass("bg-dark")
        $("#msg_area").toggleClass("message_mode")
        $(".message h4").css("color","crimson")
    })
    var reply_id
    var get_id
    $(".message__area").on("click",".repply",function(){
        var reply_data = $(this).parent().text()
        $("#reply_msg").empty()
        if (reply_data){
            if (reply_data.length<50){
                reply_id = $(this).parent().attr("id")
                $(".reply_id").html(reply_id)
                // console.log(reply_id)
                $(".outgoing").removeClass("reply_color")
                $(".incoming").removeClass("reply_color")
                $(this).parent().parent().addClass("reply_color")
                $('#reply_msg').append(`@${$(this).parent().parent().children(':first-child').text().slice(0,50)}:- `).css("color","red")
                $('#reply_msg').append(`<a href='"#"+${$(this).parent().attr("id")}'>${reply_data.slice(0,50)}</a>`).css("color","red")
            }
            else{
                $('#reply_msg').append(`@${$(this).parent().parent().children(':first-child').text().slice(0,50)}:- `).css("color","red")
                $('#reply_msg').append(reply_data.slice(0,50)+'...').css("color","red")
            }
        }
        else{
            reply_id = $(this).parent().attr("id")
            $(".reply_id").html(reply_id)
            $(".outgoing").removeClass("reply_color")
            $(".incoming").removeClass("reply_color")
            $(this).parent().parent().addClass("reply_color")
            $('#reply_msg').append(`@${$(this).parent().parent().children(':first-child').text().slice(0,50)}:- `).css("color","red")
            $('#reply_msg').append($(this).siblings().attr("src").slice(0,10)+'...').css("color","red")
        }
    })
    $('textarea').keypress(function (e) {
        var key = e.which;
        if(key == 13)
         {  
            $(".outgoing").removeClass("reply_color")
            $(".incoming").removeClass("reply_color")
           return false;  
         }
       });  
    $(".message__area").on("click",".reply_color",function(){
        $('#reply_msg').empty()
        $(".outgoing").removeClass("reply_color")
        $(".incoming").removeClass("reply_color")
    })
    $(".message__area").on("click","a",function(e){
        get_id = $(this).attr("href").slice(1)
        $(`#${get_id}`).parent().addClass("reply_color")
        setTimeout(function(){$(`#${get_id}`).parent().removeClass('reply_color'); }, 2000);
    })
    
    
})
