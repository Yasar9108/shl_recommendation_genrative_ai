export default function ApproachPage() {
  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">SHL Assessment Recommendation System: Our Approach</h1>

      <div className="prose max-w-none">
        <h2>Overview</h2>
        <p>
          Our SHL Assessment Recommendation System uses a hybrid approach combining vector similarity search and
          LLM-based reranking to provide accurate and relevant assessment recommendations based on natural language
          queries or job descriptions.
        </p>

        <h2>Data Collection and Processing</h2>
        <p>
          We collected assessment data from SHL's product catalog using a web scraper built with Cheerio. For each
          assessment, we extracted:
        </p>
        <ul>
          <li>Assessment name and URL</li>
          <li>Remote Testing Support status</li>
          <li>Adaptive/IRT Support status</li>
          <li>Duration</li>
          <li>Test type</li>
          <li>Description</li>
        </ul>
        <p>We also extracted keywords from each assessment's description to enhance the search capabilities.</p>

        <h2>Vector Representation</h2>
        <p>
          We used OpenAI's embedding model to convert assessment descriptions and metadata into high-dimensional
          vectors. This allows us to perform semantic similarity searches that understand the meaning behind queries
          rather than just matching keywords.
        </p>

        <h2>Recommendation Algorithm</h2>
        <p>Our recommendation process follows these steps:</p>
        <ol>
          <li>Convert the user query or job description into a vector using the same embedding model</li>
          <li>Perform a similarity search using cosine similarity to find the most relevant assessments</li>
          <li>
            Use an LLM (GPT-4) to rerank the initial results based on a deeper understanding of the query requirements
          </li>
          <li>Return the top recommendations to the user</li>
        </ol>

        <h2>URL Processing</h2>
        <p>When a user provides a URL to a job description, we:</p>
        <ol>
          <li>Fetch the HTML content from the URL</li>
          <li>Use an LLM to extract the relevant job description text from the HTML</li>
          <li>Process this text through our recommendation pipeline</li>
        </ol>

        <h2>Evaluation</h2>
        <p>
          We evaluated our system using Mean Recall@3 and MAP@3 metrics on a set of benchmark queries with known
          relevant assessments. This helps us measure both the coverage of relevant assessments and the quality of their
          ranking.
        </p>

        <h2>Technologies Used</h2>
        <ul>
          <li>Next.js - Full-stack React framework</li>
          <li>OpenAI API - For embeddings and LLM-based reranking</li>
          <li>Cheerio - For web scraping</li>
          <li>Tailwind CSS with shadcn/ui - For UI components</li>
          <li>Vercel - For deployment</li>
        </ul>

        <h2>Future Improvements</h2>
        <ul>
          <li>Implement user feedback loops to improve recommendations over time</li>
          <li>Add support for assessment bundles and packages</li>
          <li>Enhance the scraper to capture more detailed assessment metadata</li>
          <li>Implement caching to improve performance</li>
        </ul>
      </div>
    </main>
  )
}

