function submitMessage() {
  var inputBox = document.getElementById("message");
  var message = inputBox.value;

  if (message.trim() !== "") {
    createChatItem("user", message, "right");
    sendMessage(message);
    inputBox.value = "";
  }
}

// function sendMessage(message) {
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", "http://127.0.0.1:8000?model=gpt-4&msg=" + encodeURIComponent(message), true);
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//       var response = xhr.responseText;
//       createChatItem("bot", response, "left");
//     }
//   };
//   xhr.send();
// }
function sendMessage(message) {
  var chats = document.getElementsByClassName("chats")[0];

  // 创建占位回复消息
  var placeholderItem = document.createElement("div");
  placeholderItem.className = "chat-item left"; // 左对齐，代表机器人消息
  placeholderItem.classList.add("placeholder-reply"); // 添加占位消息的特定类名

  var placeholderAvatar = document.createElement("img");
  placeholderAvatar.alt = "机器人头像";
  placeholderAvatar.src = "mylogo.png";
  placeholderItem.appendChild(placeholderAvatar);

  var placeholderContent = document.createElement("div");
  placeholderContent.className = "content";
  placeholderContent.textContent = "正在接收回复内容                    ";
  placeholderContent.classList.add("marquee"); // 添加跑马灯动画的类名
  placeholderItem.appendChild(placeholderContent);

  chats.appendChild(placeholderItem);
  chats.scrollTop = chats.scrollHeight;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:8000?model=gpt-4&msg=" + encodeURIComponent(message), true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var response = xhr.responseText;
      // 移除占位回复消息
      chats.removeChild(placeholderItem);
      createChatItem("bot", response, "left");
      // 保存聊天记录到本地存储
      localStorage.setItem("chats", chats.innerHTML);
    }
  };
  xhr.send();
}



function createChatItem(sender, message, alignment) {
  var chats = document.getElementsByClassName("chats")[0];

  var chatItem = document.createElement("div");
  chatItem.className = "chat-item " + alignment;

  var content = document.createElement("div");
  content.className = "content";
  content.textContent = message;

  var avatar = document.createElement("img");
  avatar.alt = sender === "user" ? "头像" : "机器人头像";

  if (sender === "user") {
    avatar.src = "logo.png";
    chatItem.appendChild(content);
    chatItem.appendChild(avatar);
  } else {
    avatar.src = "mylogo.png";
    chatItem.appendChild(avatar);
    chatItem.appendChild(content);
  }

  chats.appendChild(chatItem);
  chats.scrollTop = chats.scrollHeight;
  // 保存聊天记录到本地存储
  localStorage.setItem("chats", chats.innerHTML);
}


document.getElementById("message").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitMessage();
  }
});

window.onload = function() {
  var chats = localStorage.getItem("chats");
  if(chats) {
    document.querySelector(".chats").innerHTML = chats;
    document.getElementsByClassName("chats")[0].scrollTop = document.getElementsByClassName("chats")[0].scrollHeight;
  }
}
