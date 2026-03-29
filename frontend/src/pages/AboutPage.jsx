import React from 'react';
import { HeartHandshake, Target, ShieldCheck, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 text-gray-900">
      <section className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            About SkillSamaritan
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Neighbors Helping Neighbors</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-green-100">
            SkillSamaritan is a community task-exchange platform where people share skills,
            solve real problems, and build trust through meaningful contribution.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Community First</h2>
            <p className="mt-2 text-sm text-gray-600">
              We help members exchange practical support, from tech help to daily-life tasks, in a respectful and inclusive way.
            </p>
          </article>

          <article className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Purposeful Rewards</h2>
            <p className="mt-2 text-sm text-gray-600">
              Our point system encourages genuine contribution while making it easy to recognize helpful effort across the community.
            </p>
          </article>

          <article className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Trust and Safety</h2>
            <p className="mt-2 text-sm text-gray-600">
              We design interactions around transparency, accountability, and fair task flows so members can collaborate with confidence.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
