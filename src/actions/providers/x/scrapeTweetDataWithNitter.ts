import FirecrawlApp from "@mendable/firecrawl-js";
import {
  AuthParamsType,
  xScrapePostDataWithNitterFunction,
  xScrapePostDataWithNitterParamsType,
  xScrapePostDataWithNitterOutputType,
} from "../../autogen/types";

const scrapeTweetDataWithNitter: xScrapePostDataWithNitterFunction = async ({
  params,
  authParams,
}: {
  params: xScrapePostDataWithNitterParamsType;
  authParams: AuthParamsType;
}): Promise<xScrapePostDataWithNitterOutputType> => {
  const tweetUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/(\d+)(?:\?.*)?$/;

  if (!tweetUrlRegex.test(params.tweetUrl)) {
    throw new Error(
      "Invalid tweet URL. Expected format: https://twitter.com/username/status/id or https://x.com/username/status/id",
    );
  }
  const nitterUrl = params.tweetUrl.replace(
    /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)/i,
    "https://nitter.net",
  );

  // Initialize Firecrawl
  if (!authParams.apiKey) {
    throw new Error("API key is required for X+Nitter+Firecrawl");
  }

  const firecrawl = new FirecrawlApp({
    apiKey: authParams.apiKey,
  });

  try {
    // Scrape the Nitter URL
    const result = await firecrawl.scrapeUrl(nitterUrl);

    if (!result.success) {
      throw new Error(`Failed to scrape tweet: ${result.error || "Unknown error"}`);
    }

    // Extract the tweet text from the scraped content - simple approach - in practice, you might need more robust parsing based on nitter html structure
    const tweetContent = result.markdown;

    return {
      text: tweetContent || "Error scraping with firecrawl",
    };
  } catch (error) {
    throw new Error(`Error scraping tweet: ${error}`);
  }
};

export default scrapeTweetDataWithNitter;
