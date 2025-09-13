/**
 * Twitter Auto Unretweeter
 * -------------------------
 * This script automatically finds your retweeted tweets and unretweets them.
 * If the unretweet button is missing, it retweets again and then unretweets.
 * 
 * Author: Tushar Pachouri
 */

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// Unretweet normally
const unretweetTweet = async (tweet) => {
  const btn = tweet.querySelector('[data-testid="unretweet"]');
  if (btn) {
    btn.click();
    await timer(250);

    const confirm = document.querySelector('[data-testid="unretweetConfirm"]');
    if (confirm) {
      confirm.click();
      console.log("✅ Unretweeted Successfully");
    }
  }
};

// If green button is missing: retweet again → then unretweet
const unretweetUnretweetedTweet = async (tweet) => {
  const btn = tweet.querySelector('[data-testid="retweet"]');
  if (btn) {
    btn.click();
    await timer(250);

    const confirm = document.querySelector('[data-testid="retweetConfirm"]');
    if (confirm) {
      confirm.click();
      console.log("🔄 Retweeted again to enable unretweet");
    }

    await timer(500);
    await unretweetTweet(tweet);
  }
};

// Main loop
setInterval(async () => {
  const retweetedTweetList = document.querySelectorAll('[data-testid="socialContext"]');
  console.log(`📌 Found ${retweetedTweetList.length} retweeted tweets`);

  for (const retweet of retweetedTweetList) {
    const tweetWrapper = retweet.closest('[data-testid="tweet"]');
    if (!tweetWrapper) continue;

    tweetWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    await timer(500);

    if (tweetWrapper.querySelector('[data-testid="unretweet"]')) {
      console.log("🟢 Unretweet button found → Unretweeting");
      await unretweetTweet(tweetWrapper);
    } else {
      console.log("⚪ Button missing → Retweet + Unretweet flow");
      await unretweetUnretweetedTweet(tweetWrapper);
    }

    await timer(2000);
  }

  console.log("✅ Completed current batch");
  console.log("⬇️ Scrolling for more tweets...\n");
  window.scrollTo(0, document.body.scrollHeight);
  await timer(3000);
}, 60000);
