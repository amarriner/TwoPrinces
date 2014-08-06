#!/usr/bin/env python

"""Twitter bot that tweets random (fake, obvs) drafts of the first line of Two Princes by the Spindoctors"""

import pattern.en
import random
import sys


DOING  = ['here', 'there', 'stand', 'kneel', 'sit', 'are']
EMOTE  = ['adore', 'love', 'are fond of', 'somewhat like', 'are indifferent to']
SCATS  = ['da', 'dee', 'deep', 'deepa', 'dip', 'dippa', 'dop', 'doopa', 'dub', 'dubba']
TITLES = ['kings', 'queens', 'princesses', 'dukes', 'duchesses', 'caliphs', 'emirs']
WHERE  = ['before', 'in front of', 'ahead', 'abreast of', 'aside', 'adjacent to']


def generate_scat():
   """Return random assortment of scats (?!?!?)"""

   scat = ''
   for i in range(1, random.choice(range(8, 12))):
      if len(scat):
         scat += ' '

      scat += random.choice(SCATS)

   return scat


def init_cap(s):
   """Returns a string with the first letter capitalized, and the rest lowercase"""

   return s[:1].upper() + s[1:].lower()


def main():
   """Main entry point"""

   lyric = 'Yeaaaaah <NUMBERS> <TITLE> <DOING> <WHERE> you,\n' + \
           '\t   That\'s what I said now\n'                    + \
           '<UTITLE>, <TITLE> who <EMOTE> you,\n'              + \
           '\t   Just go ahead now\n'                          + \
           '<SCAT>'

   num = random.choice(range(1, 10))
   num = pattern.en.numerals(num) + ', ' + pattern.en.numerals(num + 1)

   title = random.choice(TITLES)

   lyric = lyric.replace('<NUMBERS>', num)                    \
                .replace('<TITLE>', title)                    \
                .replace('<DOING>', random.choice(DOING))     \
                .replace('<WHERE>', random.choice(WHERE))     \
                .replace('<UTITLE>', init_cap(title))         \
                .replace('<EMOTE>', random.choice(EMOTE))     \
                .replace('<SCAT>', init_cap(generate_scat()))

   print '(' + str(len(lyric)) + ') ' + lyric

if __name__ == '__main__':
   sys.exit(main())

