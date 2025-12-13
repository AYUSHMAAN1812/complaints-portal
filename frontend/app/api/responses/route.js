export async function GET() {
    try {
        // Set CORS headers
        const headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "text/html" // Explicitly set content type
        });

        // Fetch data from Google Apps Script
        const result = await fetch(
            "https://script.google.com/a/macros/iith.ac.in/s/AKfycbyeh9t1FSPedPcJm5xqLHljCljZ95GqNXraaElwUFtyIuK_HDdMH00bpVEDawPlgjmI/exec"
        );
        
        // Check for response success
        if (!result.ok) {
            throw new Error(`Fetch failed: ${result.status} ${result.statusText}`);
        }

        const htmlText = await result.text(); // ✅ Ensure response is awaited

        return new Response(htmlText, {
            status: 200,
            headers: new Headers(headers), // ✅ Use new Headers (optional, but better)
        });
    } catch (error) {
        console.error("Error fetching HTML:", error);

        return new Response("<h1>Error 500</h1><p>Failed to fetch HTML page.</p>", {
            status: 500,
            headers: new Headers(headers), // ✅ Use new Headers (optional, but better)
        });
    }
};
