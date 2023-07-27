import { getActiveTabURL } from "./utils.js";

const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");//title
  const controlsElement = document.createElement("div");//control elements, play and delete
  const newBookmarkElement = document.createElement("div");//container that contains title and control elem

  bookmarkTitleElement.textContent = bookmark.desc; //bookmark description
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";  //css classes to style 

  setBookmarkAttributes("play", onPlay, controlsElement);//setBookmarkAttributes is called within 
  //the addNewBookmark function, it effectively creates a control button for each specified action (e.g., play or delete), sets the appropriate image source and title for the button, adds the necessary event listener for the action, and appends the button to the container (controlsElement) within the bookmark element. 
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.time; //guarantee a unique id with time for each bookmark elem
  newBookmarkElement.className = "bookmark";//classname that helps for styling
  newBookmarkElement.setAttribute("timestamp", bookmark.time); //attribute to play the video

  newBookmarkElement.appendChild(bookmarkTitleElement); 
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
  const bookmarksElement = document.getElementById("bookmarks");//dom element with id bookmarks
  bookmarksElement.innerHTML = ""; //list cleared up before adding bookmarks 

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark); //bookmarksElement- container where the new bookmark would be added
      //bookmark-info about the bookmark
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }

  return;
};

const onPlay = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};
//When the user clicks the play button on a bookmarked video, the onPlay function is triggered as the event listener.
//The function extracts the bookmarkTime from the newBookmarkElement (the parent element of the control buttons). This bookmarkTime represents the timestamp associated with the bookmarked video.
//It then retrieves information about the active tab in the browser using the getActiveTabURL() function.
//Finally, it sends a message to the active tab using chrome.tabs.sendMessage, indicating that the video at the specified bookmarkTime should be played.



const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
  }, viewBookmarks);
};

//In summary, the onDelete function handles the deletion of a bookmark when the corresponding delete button is clicked. It removes the bookmark from the DOM, sends a message to the active tab to notify any content script about 
//the deletion, and then updates the display of bookmarks on the web page using the viewBookmarks function.

  const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src; //for hovering to get eg:play or delete
  controlElement.addEventListener("click", eventListener);//So, "click" is a built-in event type in JavaScript
  // that represents mouse click events, and it's used to respond
  // to user interactions, like clicking buttons, links, or other clickable elements on a web page
  controlParentElement.appendChild(controlElement); //container where control buttons are placed within each bookmark elem 
};


document.addEventListener("DOMContentLoaded", async () => { //when html loaded
  const activeTab = await getActiveTabURL(); //func urls
  const queryParameters = activeTab.url.split("?")[1]; //query parameters to help us identify the video,first index
  const urlParameters = new URLSearchParams(queryParameters);//get unique identifier,creates a URLSearchParams object to conveniently work with individual query parameters

  const currentVideo = urlParameters.get("v"); //https://www.youtube.com/watch?v=abc123, the value of "v" would be "abc123."
// Purpose Explanation: By extracting the "v" query parameter, the code can determine the unique identifier of the current YouTube video being viewed. 

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => { //get it with the key, youtube video's unique id
      const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0]; //not on youtube page

    container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
  }//The container.innerHTML line is used to display a message in the DOM (Document Object Model) by modifying the HTML content of an element with the class "container." 
});

