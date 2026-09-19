import AnimatedSection from "./AnimatedSection";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  accentWord?: string;
}

export default function PageHeader({
  title,
  subtitle,
  accentWord,
}: PageHeaderProps) {
  const renderTitle = () => {
    if (!accentWord) {
      return <span>{title}</span>;
    }
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="gradient-accent-text">{accentWord}</span>
        {parts[1] || ""}
      </>
    );
  };

  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="max-w-3xl">
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
              {renderTitle()}
            </h1>
            <p className="text-body text-text-secondary text-lg md:text-xl">
              {subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Decorative accent line */}
        <AnimatedSection delay={0.3}>
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-20 bg-accent" />
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
