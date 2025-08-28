export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 text-[#593E2E]">Contact Us</h1>
      <p className="text-lg leading-relaxed text-[#684536] mb-4">
        We&aposd love to hear from you! Reach out with questions, suggestions, or feedback.
      </p>
      <form className="space-y-4 max-w-md">
        <label className="block">
          <span className="text-[#593E2E] font-semibold">Your Email</span>
          <input type="email" className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="text-[#593E2E] font-semibold">Message</span>
          <textarea rows={4} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder="Write your message here..." />
        </label>
        <button type="submit" className="bg-[#593E2E] text-white px-4 py-2 rounded hover:bg-[#8C6954] transition">
          Send
        </button>
      </form>
    </main>
  );
}
