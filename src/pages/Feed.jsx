import React, { useState, useEffect, useContext } from "react";
import styles from "./Feed.module.css";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore/lite";
import Tweet from "../components/Tweet";
import Tweetbox from "../components/Tweetbox";
import PageTitle from "../components/PageTitle";
import { UserContext } from "../App";

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const context = useContext(UserContext);

  async function getTweets() {
    try {
      const tweetsCollection = query(
        collection(db, "tweets"),
        orderBy("time", "desc")
      );
      const tweetsSnapshot = await getDocs(tweetsCollection);
      setTweets(
        tweetsSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTweets();
  }, []);

  return (
    <div className={styles.feed}>
      <PageTitle page="Home" back={false} />
      {context?.user ? <Tweetbox getTweets={getTweets} /> : null}
      {tweets.map((tweet) => (
        <Tweet key={Math.random()} tweet={tweet} />
      ))}
    </div>
  );
};

export default Feed;