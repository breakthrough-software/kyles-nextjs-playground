import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (pathname: string) => router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="left">
      <Link href="/" className="bold" data-active={isActive('/')}>
        Feed
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        .left :global(a), .left :global(.bold) {
          text-decoration: none;
          color: var(--geist-foreground);
          display: inline-block;
        }

        .left :global([data-active='true']) {
          color: gray;
        }

        .left :global(a + a) {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/" className="bold" data-active={isActive('/')}>
          Feed
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          .left :global(a), .left :global(.bold) {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left :global([data-active='true']) {
            color: gray;
          }

          .left :global(a + a) {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin" data-active={isActive('/signup')}>
          Log in
        </Link>
        <style jsx>{`
          .right :global(a) {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
            border: 1px solid var(--geist-foreground);
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          .right :global(a + a) {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/" className="bold" data-active={isActive('/')}>
          Feed
        </Link>
        <Link href="/drafts" data-active={isActive('/drafts')}>
          My drafts
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          .left :global(a), .left :global(.bold) {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left :global([data-active='true']) {
            color: gray;
          }

          .left :global(a + a) {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create">
          <button>New post</button>
        </Link>
        <button onClick={() => signOut()}>Log out</button>
        <style jsx>{`
          .right {
            margin-left: auto;
          }

          .right p {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
          }

          .right :global(button) {
            border: none;
            background: none;
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
            border: 1px solid var(--geist-foreground);
            padding: 0.5rem 1rem;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;