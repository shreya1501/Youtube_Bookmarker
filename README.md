# Youtube_Bookmarker
<br>

**Technical implementation details**

1)Import Function: The code imports <ins>getActiveTabURL</ins> to obtain the URL of the currently active tab, which is essential for managing bookmarks.

2)Create Bookmark Elements: The <ins>addNewBookmark</ins> function builds HTML elements for each bookmark, including a title and buttons for playback and deletion.

3)Get Timestamp for Playback: In the <ins>onPlay</ins> function, the timestamp of the selected bookmark is retrieved from its attributes, enabling playback at the correct moment in the video.

4)Remove Bookmark from Display: The <ins>onDelete</ins> function finds the bookmark by its unique ID and removes it from the HTML when the delete button is clicked.

5)Create Control Buttons: The <ins>setBookmarkAttributes</ins> function generates buttons (play and delete) for each bookmark, setting their images and adding click event listeners for user interaction.

6)Wait for Page Load: The code listens for the DOMContentLoaded event, which indicates that the HTML document has fully loaded, before executing any initialization logic.

7)Extract Video ID from URL: The script uses the <ins>URLSearchParams</ins> API to extract the unique video ID from the YouTube video URL, which is necessary for storing and retrieving bookmarks.

8)Retrieve Bookmarks from Storage: The code uses <ins>chrome.storage.sync.get</ins> to fetch the bookmarks associated with the current video ID from Chrome's storage, allowing users to see their saved bookmarks.

9)Display Message for Unsupported Pages: If the active tab is not a YouTube video page, the code updates the display to inform the user that bookmarking is not possible on that page.

<br>

https://www.loom.com/share/dc76b0b4b3c8445eacbaa30e3dbab795?sid=8f6a5428-50c9-4e0f-8a59-5cb916070a9d

