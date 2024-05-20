const Header = ({ title }: { title: string }) => {
  return `
    <div class="header">
      <p class="heading">${title}</p>
    </div>`;
};

export default Header;
