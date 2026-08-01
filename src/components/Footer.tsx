export default function Footer() {
  return (
    <footer
      className="
      border-t
      mt-20
      py-8
      text-center
      text-sm
      text-slate-500
      dark:text-slate-400
      "
    >
      © {new Date().getFullYear()} Car Catalog
    </footer>
  );
}
