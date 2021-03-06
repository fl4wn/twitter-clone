import React, { useContext, useRef, useState } from "react";
import styles from "./Tweetbox.module.css";
import UserContext from "../UserContext";
//Firebase
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore/lite";
//Icons
import { FaPhotoVideo } from "react-icons/fa";

const Tweetbox = ({ getTweets, parentTweet }) => {
  const [showImageInput, setShowImageInput] = useState(false);
  const context = useContext(UserContext);
  const TweetText = useRef(null);
  const ImageURL = useRef(null);

  const toggleImageInput = () => {
    setShowImageInput((currentValue) => !currentValue);
  };

  const sendTweet = async (event) => {
    event.preventDefault();
    if (!context?.user) return;

    const tweet = {
      uid: context?.user?.uid,
      name: context?.user?.displayName,
      userPhoto: context?.user?.photoURL,
      text: TweetText.current?.value,
      image: ImageURL.current?.value || "",
      time: Timestamp.now().toDate(),
      likes: [],
      bookmarks: [],
      parentTweet: parentTweet,
    };

    try {
      await addDoc(collection(db, "tweets"), tweet);
      getTweets();
      TweetText.current.value = "";
      if (ImageURL.current) ImageURL.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className={styles.tweetbox} onSubmit={sendTweet}>
      <img src={context?.user?.photoURL} alt="avatar" className="profileicon" />
      <div className={styles.tweet}>
        <textarea
          type="text"
          placeholder="What's happening?"
          className={styles.input}
          ref={TweetText}
          required
        />

        <div className={styles.send}>
          <div className={styles.media}>
            <div className={styles.mediaicon} onClick={toggleImageInput}>
              <FaPhotoVideo />
            </div>
            {showImageInput && (
              <input
                type="url"
                placeholder="Image URL"
                className={styles.imageinput}
                ref={ImageURL}
                required
              ></input>
            )}
          </div>
          <input type="submit" className={styles.btn} value="Tweet" />
        </div>
      </div>
    </form>
  );
};

export default Tweetbox;
