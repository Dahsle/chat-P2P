 const btn = document.querySelector('.btn-toggle');
btn.addEventListener('click', function() {
document.body.classList.toggle('dark-theme');  
})

   const id_center_open_popup = document.getElementById("open-center-popup");
id_center_open_popup.addEventListener("click", function(event){
  event.preventDefault();
  const url = this.href;
  const width = 800;
  const height = 500;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;
  const window_size = 'width='+width+',height='+height+',left='+left+',top='+top;
  popupWindow = window.open(url, 'myWindow', window_size);
});