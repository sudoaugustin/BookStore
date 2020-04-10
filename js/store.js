const $ = require('jquery');
const axios = require('axios');
$(document).ready(e=>{
  $("#createStore").click(e=>{
    var s_form=`
                <div class="store_form_root">
                  <i class='bx bx-x'></i>
                  <form>
                    <h3>Enter store information</h3>
                    <fieldset id="name">
                      <label for="name">Name</label>
                      <div class="textField">
                        <input type="text" name="name" placeholder="Enter your store name">
                      </div>
                      <label for="name"  class="msg"></label>
                    </fieldset>
                    <fieldset id="add">
                      <label for="address">Address</label>
                      <div class="textField">
                        <input type="text" name="address" placeholder="Enter your store address">
                      </div>
                      <label for="address"  class="msg"></label>
                    </fieldset>
                    <div class="btn">
                      <input type="submit" name="submit" value="Submit">
                    </div>
                  </form>
                </div>`;
    $(".popover").fadeIn().html(s_form).addClass("show");
    $(".store_form_root .bx-x").click(e=>{
      $(".popover")
      .fadeOut()
      .html("")
      .removeClass("show");
    });
    $(".btn input").click(e=>{
      var name='#name',
          address='#add',
          nameInput=$(`${name} input`),
          addressInput=$(`${address} input`);
      e.preventDefault();
      if(!nameInput.val()){
        $(`${name} div`).addClass("err");
        $(`${name} .msg`).html("Enter shop name")
      }
      else{
        $(`${name} div`).removeClass("err");
        $(`${name} .msg`).html()
      }
      if(!addressInput.val()){
        console.log($(`${address}`));
        $(`${address} div`).addClass("err");
        $(`${address} .msg`).html("Enter shop address")
      }
      else{
        $(`${address} div`).removeClass("err");
        $(`${address} .msg`).html()
      }
      if(!$(".textField.err").length){
        axios.post("/shop",{
          name:nameInput.val(),
          address:addressInput.val()
        })
        .then(res=>{
          $('.popover')
          .html(`
            <div class='success_model'>
               <i class='bx bx-check-double'></i>
               <h2>Shop created successfully</h2>
               <p>Your shop was created successfully</p>
               <span class="btn">OK</span>
            </div>
          `);
         $('.success_model .btn').click(e=>{
          $('.popover').fadeOut().html("").removeClass("show");
          $("nav ul li:nth-child(2)").click();
         })
        })
        .catch(err=>console.log(err.response));
      }
    });
  });
  $(".store_card .visit").click(e=>{
    const ele=e.delegateTarget,id=ele.id;
    axios.get("/shop/"+id)
    .then(res=>{
      $(".pages").html(res.data);
    })
    .catch(e=>console.log(e.response));
  });
  $(".subscribe, .unsubscribe").click(e=>{
    const ele=e.delegateTarget,s_id=ele.id;
    $(`.subscribe#${s_id}, .unsubscribe#${s_id}`).toggleClass("subscribe unsubscribe");
    var subscribed=$(ele).hasClass("unsubscribe");
    subscribed?$(`.subscribe#${s_id}, .unsubscribe#${s_id}`).html("Unsubscribe"):$(`.subscribe#${s_id}, .unsubscribe#${s_id}`).html("Subscribe");
    axios.post("/subscribe",{
      s_id,
      subscribed
    });
  });
});
