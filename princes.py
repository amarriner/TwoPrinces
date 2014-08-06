#!/usr/bin/env python

"""Twitter bot that tweets random (fake, obvs) drafts of the first line of Two Princes by the Spin Doctors"""

import keys
import pattern.en
import random
import sys
import twitter


DOING  = ['here', 'there', 'stand', 'kneel', 'sit', 'are']
EMOTE  = ['adore', 'love', 'are fond of', 'somewhat like', 'are indifferent to', 'have taken a shine to', 'are sweet on', 
          'kinda dislike', 'sorta hate']
SCATS  = ['da', 'dee', 'deep', 'deepa', 'dip', 'dippa', 'dop', 'doopa', 'dub', 'dubba']
TITLES = ['kings', 'queens', 'princesses', 'dukes', 'duchesses', 'caliphs', 'emirs', 'emperors', 'empresses', 'archdukes',
          'archduchesses', 'viceroys', 'vicereines', 'marquesses', 'marchionesses', 'counts', 'countesses', 'earls',
          'viscounts', 'viscountesses', 'barons', 'baronesses', 'ranas', 'ranis', 'sultans', 'sultanas', 'emiras', 'caliphas',
          'maharajas', 'maharanis', 'padishahs', 'shahs', 'shabanus', 'khagans', 'khanums', 'pharaohs', 'satraps', 'omukamas', 
          'sarkis', 'maliks', 'almamis', 'mwamis', 'arkhoonds', 'datus', 'holkars', 'hwangjes', 'lakans', 'nawabs', 'nizams',
          'rachas']
WHERE  = ['before', 'in front of', 'ahead of', 'abreast of', 'aside', 'adjacent to', 'off to the side of']


def generate_scat(l):
   """Return random assortment of scats (?!?!?)"""

   scat = ''
   for i in range(1, random.choice(range(8, 12))):
      if len(scat):
         scat += ' '

      next = random.choice(SCATS)
      if len(l + scat + next) < 140:
         scat += next
      else:
         break

   return scat


def init_cap(s):
   """Returns a string with the first letter capitalized, and the rest lowercase"""

   return s[:1].upper() + s[1:].lower()


def main():
   """Main entry point"""

   lyric = ''

   while len(lyric) == 0 or len(lyric) > 140:
      if len(lyric) > 140:
         print '*** Lyric too long, trying again! ***'

      lyric = 'Yeah <NUMBERS> <TITLE> <DOING> <WHERE> you\n'     + \
              '\tThat\'s what I said now\n'                      + \
              '<UTITLE>, <TITLE> who <EMOTE> you\n'              + \
              '\tJust go ahead now\n'

      num = random.choice(range(1, 10))
      num = pattern.en.numerals(num) + ', ' + pattern.en.numerals(num + 1)

      title = random.choice(TITLES)

      lyric = lyric.replace('<NUMBERS>', num)                    \
                   .replace('<TITLE>', title)                    \
                   .replace('<DOING>', random.choice(DOING))     \
                   .replace('<WHERE>', random.choice(WHERE))     \
                   .replace('<UTITLE>', init_cap(title))         \
                   .replace('<EMOTE>', random.choice(EMOTE))

      scat = init_cap(generate_scat(lyric))
      lyric += scat

      print '(' + str(len(lyric)) + ') ' + lyric

   # Connect to Twitter
   api = twitter.Api(keys.consumer_key, keys.consumer_secret, keys.access_token, keys.access_token_secret)

   # Tweet
   status = api.PostUpdate(lyric)


if __name__ == '__main__':
   sys.exit(main())

