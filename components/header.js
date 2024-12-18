export default function Header() {
  return (
    <div className="text-lg m-8">
      <header>
        <p>
          This <span className="font-bold">online image optimizer</span> uses a
          combination of the best compression algorithms to shrink JPEG, PNG,
          and WebP images to the smallest possible size while maintaining the
          quality you need.
        </p>

        <br />

        <p className="mb-4">
          Upload your image and adjust compression settings for optimal size and
          quality!
        </p>
      </header>
    </div>
  );
}