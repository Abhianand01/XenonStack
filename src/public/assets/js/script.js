$(document).ready(function(){
    var toggle=1;
    $('.stud').on('click',function(){
        $('#studbox').addClass('show');
        $('.overlay').addClass('show');
        $('.two').css("display", "none")
    });
    $('#clo').on('click',function(){
        $('#studbox').removeClass('show');
        $('.overlay').removeClass('show');
        $('.one').css('display','');
        $('.two').css('display','');

    });
    $('.teach').on('click',function(){
        $('#teachbox').addClass('show');
        $('.overlay').addClass('show');
        $('#teachbox .two').css("display", "none")
    });


    $('#teachreg').on('click',function(){
        $('.one').css("display", "none")
        $('.two').css("display", "")
    });


    $('#teachlogBtn').on('click',function(){
        $('.two').css("display", "none");
        $('.one').css("display","");
    });

    $('#tclo').on('click',function(){
        $('#teachbox').removeClass('show');
        $('.overlay').removeClass('show');

    });
    $('#reg').on('click',function(){
        $('.one').css("display", "none");
        $('.two').css("display","");
    });
    $('#logBtn').on('click',function(){
        $('.two').css("display", "none");
        $('.one').css("display","");
    });

    $('#teacherLogout').on('click', (e)=>{
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/teacher/logout',
            success: function(){
                window.location = 'http://localhost:3000/'
            }
        })
    })

    $('#studentLogout').on('click', (e)=>{
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/student/logout',
            success: function(){
                window.location = 'http://localhost:3000/'
            }
        })
    })


    $('.subjectCard').on('click', (e)=>{
        const id = e.currentTarget.id;

        $.ajax({
            method: 'Get',
            url: '/teacher/subjectStudent',
            dataType: 'json',
            data: {"id" : id},
            success: function(res)
            {
             console.log(res)   
            }
        })
    })

    
});