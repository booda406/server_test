/**
 * August 3, 2012 Modifications:
 * 
 *    * Applied solution for possible variable scoping issues. 
 *    * Namespaces the Recognizer and Point classes.
 *    
 *    Jonathan Cipriano
 *    AKQA, Creative Research & Development
 *    118 King Street, 6th Floor
 *    San Francisco, CA 94108
 *
 * The $1 Unistroke Recognizer (C# version)
 *
 *		Jacob O. Wobbrock, Ph.D.
 * 		The Information School
 *		University of Washington
 *		Mary Gates Hall, Box 352840
 *		Seattle, WA 98195-2840
 *		wobbrock@uw.edu
 *
 *		Andrew D. Wilson, Ph.D.
 *		Microsoft Research
 *		One Microsoft Way
 *		Redmond, WA 98052
 *		awilson@microsoft.com
 *
 *		Yang Li, Ph.D.
 *		Department of Computer Science and Engineering
 * 		University of Washington
 *		The Allen Center, Box 352350
 *		Seattle, WA 98195-2840
 * 		yangli@cs.washington.edu
 *
 * The Protractor enhancement was published by Yang Li and programmed here by 
 * Jacob O. Wobbrock.
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture 
 *	  recognizer. Proceedings of the ACM Conference on Human 
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 * 
 * This software is distributed under the "New BSD License" agreement:
 * 
 * Copyright (c) 2007-2011, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote 
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, 
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/

(function(){
  
  var Dollar = this.Dollar = { };

  //
  // Point class
  //
  Dollar.Point = function(x, y) // constructor
  {
  	this.X = x;
  	this.Y = y;
  }
  //
  // Rectangle class
  //
  function Rectangle(x, y, width, height) // constructor
  {
  	this.X = x;
  	this.Y = y;
  	this.Width = width;
  	this.Height = height;
  }
  //
  // Template class: a unistroke template
  //
  function Template(name, points) // constructor
  {
  	this.Name = name;
  	this.Points = Resample(points, NumPoints);
  	var radians = IndicativeAngle(this.Points);
  	this.Points = RotateBy(this.Points, -radians);
  	this.Points = ScaleTo(this.Points, SquareSize);
  	this.Points = TranslateTo(this.Points, Origin);
  	this.Vector = Vectorize(this.Points); // for Protractor
  }
  //
  // Result class
  //
  function Result(name, score) // constructor
  {
  	this.Name = name;
  	this.Score = score;
  }
  //
  // DollarRecognizer class constants
  //
  var NumTemplates = 7;
  var NumPoints = 64;
  var SquareSize = 250.0;
  var Origin = new Dollar.Point(0,0);
  var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
  var HalfDiagonal = 0.5 * Diagonal;
  var AngleRange = Deg2Rad(45.0);
  var AnglePrecision = Deg2Rad(2.0);
  var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
  //
  // DollarRecognizer class
  //
  Dollar.Recognizer = function() // constructor
  {
  	//
  	// one predefined template for each unistroke type
  	//
  	this.Templates = new Array();
  	this.Templates[0] = new Template("C", new Array(new Dollar.Point(607, 68),new Dollar.Point(593, 68),new Dollar.Point(583, 68),new Dollar.Point(571, 68),new Dollar.Point(556, 68),new Dollar.Point(541, 68),new Dollar.Point(525, 70),new Dollar.Point(515, 75),new Dollar.Point(504, 80),new Dollar.Point(496, 84),new Dollar.Point(489, 89),new Dollar.Point(483, 95),new Dollar.Point(477, 101),new Dollar.Point(472, 106),new Dollar.Point(466, 113),new Dollar.Point(460, 119),new Dollar.Point(453, 126),new Dollar.Point(445, 134),new Dollar.Point(438, 144),new Dollar.Point(431, 153),new Dollar.Point(423, 161),new Dollar.Point(419, 170),new Dollar.Point(418, 171),new Dollar.Point(415, 178),new Dollar.Point(413, 183),new Dollar.Point(411, 187),new Dollar.Point(410, 193),new Dollar.Point(409, 198),new Dollar.Point(409, 202),new Dollar.Point(409, 206),new Dollar.Point(409, 212),new Dollar.Point(409, 220),new Dollar.Point(409, 230),new Dollar.Point(411, 243),new Dollar.Point(414, 250),new Dollar.Point(417, 258),new Dollar.Point(422, 267),new Dollar.Point(426, 272),new Dollar.Point(433, 280),new Dollar.Point(440, 285),new Dollar.Point(447, 290),new Dollar.Point(455, 294),new Dollar.Point(465, 299),new Dollar.Point(474, 304),new Dollar.Point(485, 308),new Dollar.Point(500, 313),new Dollar.Point(513, 315),new Dollar.Point(529, 318),new Dollar.Point(546, 320),new Dollar.Point(561, 321),new Dollar.Point(579, 321),new Dollar.Point(597, 321),new Dollar.Point(608, 321),new Dollar.Point(621, 321),new Dollar.Point(635, 321),new Dollar.Point(647, 319),new Dollar.Point(657, 315),new Dollar.Point(668, 313),new Dollar.Point(677, 308),new Dollar.Point(687, 305),new Dollar.Point(694, 303),new Dollar.Point(704, 300),new Dollar.Point(708, 298),new Dollar.Point(712, 296),new Dollar.Point(716, 295),new Dollar.Point(718, 294),new Dollar.Point(720, 293),new Dollar.Point(721, 293),new Dollar.Point(721, 292)));
  	this.Templates[1] = new Template("Z", new Array(new Dollar.Point(481, 73),new Dollar.Point(500, 73),new Dollar.Point(512, 73),new Dollar.Point(526, 73),new Dollar.Point(544, 73),new Dollar.Point(564, 73),new Dollar.Point(583, 73),new Dollar.Point(602, 73),new Dollar.Point(620, 73),new Dollar.Point(637, 73),new Dollar.Point(645, 73),new Dollar.Point(657, 73),new Dollar.Point(665, 72),new Dollar.Point(672, 71),new Dollar.Point(677, 70),new Dollar.Point(683, 70),new Dollar.Point(687, 70),new Dollar.Point(691, 70),new Dollar.Point(695, 70),new Dollar.Point(697, 70),new Dollar.Point(699, 70),new Dollar.Point(700, 70),new Dollar.Point(701, 70),new Dollar.Point(702, 70),new Dollar.Point(701, 70),new Dollar.Point(700, 70),new Dollar.Point(699, 70),new Dollar.Point(697, 71),new Dollar.Point(695, 72),new Dollar.Point(693, 74),new Dollar.Point(690, 76),new Dollar.Point(685, 81),new Dollar.Point(679, 88),new Dollar.Point(669, 98),new Dollar.Point(658, 109),new Dollar.Point(645, 121),new Dollar.Point(632, 133),new Dollar.Point(621, 144),new Dollar.Point(610, 154),new Dollar.Point(600, 161),new Dollar.Point(592, 169),new Dollar.Point(584, 176),new Dollar.Point(578, 182),new Dollar.Point(571, 189),new Dollar.Point(568, 195),new Dollar.Point(562, 201),new Dollar.Point(555, 209),new Dollar.Point(551, 213),new Dollar.Point(546, 218),new Dollar.Point(542, 222),new Dollar.Point(535, 228),new Dollar.Point(531, 231),new Dollar.Point(526, 237),new Dollar.Point(523, 240),new Dollar.Point(519, 244),new Dollar.Point(514, 248),new Dollar.Point(512, 251),new Dollar.Point(510, 254),new Dollar.Point(508, 256),new Dollar.Point(507, 258),new Dollar.Point(505, 261),new Dollar.Point(504, 263),new Dollar.Point(502, 266),new Dollar.Point(501, 268),new Dollar.Point(500, 271),new Dollar.Point(499, 273),new Dollar.Point(498, 275),new Dollar.Point(496, 277),new Dollar.Point(495, 278),new Dollar.Point(494, 279),new Dollar.Point(494, 280),new Dollar.Point(493, 281),new Dollar.Point(492, 282),new Dollar.Point(492, 283),new Dollar.Point(493, 283),new Dollar.Point(495, 283),new Dollar.Point(496, 283),new Dollar.Point(499, 283),new Dollar.Point(502, 283),new Dollar.Point(505, 282),new Dollar.Point(507, 282),new Dollar.Point(510, 282),new Dollar.Point(513, 282),new Dollar.Point(518, 281),new Dollar.Point(524, 281),new Dollar.Point(531, 280),new Dollar.Point(542, 279),new Dollar.Point(553, 278),new Dollar.Point(567, 276),new Dollar.Point(578, 275),new Dollar.Point(589, 273),new Dollar.Point(604, 271),new Dollar.Point(618, 269),new Dollar.Point(632, 268),new Dollar.Point(641, 267),new Dollar.Point(652, 266),new Dollar.Point(661, 265),new Dollar.Point(673, 265),new Dollar.Point(680, 264),new Dollar.Point(687, 263),new Dollar.Point(692, 262),new Dollar.Point(698, 259),new Dollar.Point(702, 259),new Dollar.Point(706, 259),new Dollar.Point(708, 258),new Dollar.Point(709, 258),new Dollar.Point(711, 258),new Dollar.Point(712, 258),new Dollar.Point(713, 258),new Dollar.Point(713, 257),new Dollar.Point(714, 257),new Dollar.Point(715, 257),new Dollar.Point(716, 257),new Dollar.Point(717, 257),new Dollar.Point(718, 257),new Dollar.Point(719, 257),new Dollar.Point(720, 257)));
  	this.Templates[2] = new Template("&", new Array(new Dollar.Point(652, 283),new Dollar.Point(547, 191),new Dollar.Point(538, 181),new Dollar.Point(532, 178),new Dollar.Point(523, 171),new Dollar.Point(517, 165),new Dollar.Point(509, 157),new Dollar.Point(502, 151),new Dollar.Point(497, 147),new Dollar.Point(491, 143),new Dollar.Point(486, 138),new Dollar.Point(482, 135),new Dollar.Point(481, 133),new Dollar.Point(480, 132),new Dollar.Point(479, 130),new Dollar.Point(479, 129),new Dollar.Point(478, 127),new Dollar.Point(478, 125),new Dollar.Point(478, 123),new Dollar.Point(478, 122),new Dollar.Point(478, 120),new Dollar.Point(478, 119),new Dollar.Point(478, 116),new Dollar.Point(478, 115),new Dollar.Point(479, 113),new Dollar.Point(480, 112),new Dollar.Point(484, 110),new Dollar.Point(490, 106),new Dollar.Point(498, 102),new Dollar.Point(505, 99),new Dollar.Point(508, 97),new Dollar.Point(511, 97),new Dollar.Point(512, 97),new Dollar.Point(513, 97),new Dollar.Point(514, 97),new Dollar.Point(515, 97),new Dollar.Point(520, 100),new Dollar.Point(529, 107),new Dollar.Point(540, 113),new Dollar.Point(555, 123),new Dollar.Point(567, 133),new Dollar.Point(572, 138),new Dollar.Point(575, 143),new Dollar.Point(577, 145),new Dollar.Point(577, 146),new Dollar.Point(578, 147),new Dollar.Point(578, 148),new Dollar.Point(578, 149),new Dollar.Point(578, 151),new Dollar.Point(578, 154),new Dollar.Point(577, 159),new Dollar.Point(574, 165),new Dollar.Point(567, 175),new Dollar.Point(559, 189),new Dollar.Point(550, 203),new Dollar.Point(544, 211),new Dollar.Point(539, 219),new Dollar.Point(536, 225),new Dollar.Point(534, 228),new Dollar.Point(533, 231),new Dollar.Point(532, 233),new Dollar.Point(532, 235),new Dollar.Point(531, 239),new Dollar.Point(530, 242),new Dollar.Point(530, 245),new Dollar.Point(530, 248),new Dollar.Point(530, 253),new Dollar.Point(530, 258),new Dollar.Point(532, 267),new Dollar.Point(534, 274),new Dollar.Point(538, 279),new Dollar.Point(540, 284),new Dollar.Point(543, 286),new Dollar.Point(545, 289),new Dollar.Point(548, 290),new Dollar.Point(550, 291),new Dollar.Point(555, 291),new Dollar.Point(563, 291),new Dollar.Point(568, 291),new Dollar.Point(577, 291),new Dollar.Point(584, 291),new Dollar.Point(590, 289),new Dollar.Point(594, 286),new Dollar.Point(600, 283),new Dollar.Point(603, 279),new Dollar.Point(607, 275),new Dollar.Point(609, 272),new Dollar.Point(611, 269),new Dollar.Point(612, 267),new Dollar.Point(614, 264),new Dollar.Point(616, 262),new Dollar.Point(618, 259),new Dollar.Point(620, 257),new Dollar.Point(622, 256),new Dollar.Point(623, 254),new Dollar.Point(624, 253),new Dollar.Point(625, 252),new Dollar.Point(626, 249),new Dollar.Point(628, 247),new Dollar.Point(632, 242),new Dollar.Point(634, 240),new Dollar.Point(637, 236),new Dollar.Point(639, 233),new Dollar.Point(643, 230),new Dollar.Point(644, 228),new Dollar.Point(645, 228),new Dollar.Point(645, 227)));
  	this.Templates[3] = new Template("@", new Array(new Dollar.Point(580, 147),new Dollar.Point(555, 147),new Dollar.Point(543, 147),new Dollar.Point(530, 147),new Dollar.Point(520, 147),new Dollar.Point(510, 148),new Dollar.Point(503, 153),new Dollar.Point(496, 159),new Dollar.Point(488, 167),new Dollar.Point(483, 176),new Dollar.Point(477, 185),new Dollar.Point(474, 192),new Dollar.Point(470, 200),new Dollar.Point(469, 206),new Dollar.Point(468, 209),new Dollar.Point(468, 212),new Dollar.Point(468, 214),new Dollar.Point(469, 219),new Dollar.Point(474, 226),new Dollar.Point(478, 234),new Dollar.Point(486, 244),new Dollar.Point(492, 249),new Dollar.Point(499, 253),new Dollar.Point(505, 256),new Dollar.Point(512, 258),new Dollar.Point(520, 258),new Dollar.Point(527, 258),new Dollar.Point(535, 258),new Dollar.Point(542, 258),new Dollar.Point(548, 257),new Dollar.Point(553, 254),new Dollar.Point(558, 252),new Dollar.Point(564, 249),new Dollar.Point(567, 246),new Dollar.Point(571, 242),new Dollar.Point(573, 239),new Dollar.Point(575, 235),new Dollar.Point(576, 230),new Dollar.Point(579, 225),new Dollar.Point(580, 222),new Dollar.Point(580, 215),new Dollar.Point(580, 209),new Dollar.Point(580, 202),new Dollar.Point(580, 196),new Dollar.Point(580, 189),new Dollar.Point(580, 183),new Dollar.Point(580, 179),new Dollar.Point(580, 174),new Dollar.Point(580, 167),new Dollar.Point(580, 161),new Dollar.Point(579, 155),new Dollar.Point(579, 152),new Dollar.Point(578, 150),new Dollar.Point(578, 149),new Dollar.Point(578, 148),new Dollar.Point(578, 147),new Dollar.Point(578, 146),new Dollar.Point(578, 145),new Dollar.Point(578, 144),new Dollar.Point(576, 144),new Dollar.Point(576, 146),new Dollar.Point(576, 148),new Dollar.Point(576, 152),new Dollar.Point(576, 156),new Dollar.Point(576, 161),new Dollar.Point(576, 166),new Dollar.Point(576, 173),new Dollar.Point(576, 184),new Dollar.Point(576, 194),new Dollar.Point(576, 205),new Dollar.Point(578, 220),new Dollar.Point(579, 227),new Dollar.Point(581, 240),new Dollar.Point(583, 250),new Dollar.Point(585, 262),new Dollar.Point(588, 272),new Dollar.Point(590, 278),new Dollar.Point(592, 284),new Dollar.Point(594, 286),new Dollar.Point(596, 289),new Dollar.Point(598, 290),new Dollar.Point(600, 290),new Dollar.Point(604, 290),new Dollar.Point(608, 290),new Dollar.Point(613, 290),new Dollar.Point(619, 287),new Dollar.Point(624, 284),new Dollar.Point(628, 279),new Dollar.Point(631, 274),new Dollar.Point(634, 267),new Dollar.Point(636, 257),new Dollar.Point(638, 247),new Dollar.Point(639, 232),new Dollar.Point(639, 219),new Dollar.Point(639, 203),new Dollar.Point(639, 187),new Dollar.Point(639, 175),new Dollar.Point(639, 165),new Dollar.Point(639, 159),new Dollar.Point(637, 153),new Dollar.Point(635, 150),new Dollar.Point(631, 145),new Dollar.Point(624, 139),new Dollar.Point(619, 134),new Dollar.Point(610, 127),new Dollar.Point(604, 125),new Dollar.Point(597, 121),new Dollar.Point(587, 117),new Dollar.Point(575, 114),new Dollar.Point(566, 114),new Dollar.Point(557, 113),new Dollar.Point(547, 113),new Dollar.Point(538, 113),new Dollar.Point(529, 113),new Dollar.Point(516, 113),new Dollar.Point(506, 113),new Dollar.Point(496, 113),new Dollar.Point(486, 114),new Dollar.Point(479, 116),new Dollar.Point(475, 117),new Dollar.Point(472, 118),new Dollar.Point(471, 120),new Dollar.Point(468, 122),new Dollar.Point(466, 125),new Dollar.Point(463, 129),new Dollar.Point(459, 134),new Dollar.Point(455, 140),new Dollar.Point(450, 148),new Dollar.Point(446, 154),new Dollar.Point(443, 161),new Dollar.Point(440, 168),new Dollar.Point(438, 176),new Dollar.Point(434, 184),new Dollar.Point(433, 190),new Dollar.Point(433, 195),new Dollar.Point(433, 205),new Dollar.Point(433, 218),new Dollar.Point(433, 236),new Dollar.Point(437, 257),new Dollar.Point(442, 276),new Dollar.Point(449, 291),new Dollar.Point(452, 298),new Dollar.Point(457, 306),new Dollar.Point(461, 310),new Dollar.Point(465, 314),new Dollar.Point(473, 322),new Dollar.Point(480, 329),new Dollar.Point(490, 336),new Dollar.Point(495, 340),new Dollar.Point(502, 344),new Dollar.Point(510, 347),new Dollar.Point(517, 348),new Dollar.Point(526, 348),new Dollar.Point(537, 348),new Dollar.Point(549, 347),new Dollar.Point(563, 343),new Dollar.Point(575, 339),new Dollar.Point(586, 336),new Dollar.Point(593, 334),new Dollar.Point(598, 332),new Dollar.Point(602, 330),new Dollar.Point(607, 327),new Dollar.Point(612, 324),new Dollar.Point(618, 318),new Dollar.Point(623, 315),new Dollar.Point(628, 312),new Dollar.Point(633, 309),new Dollar.Point(636, 308),new Dollar.Point(639, 305),new Dollar.Point(642, 303),new Dollar.Point(644, 302),new Dollar.Point(646, 300),new Dollar.Point(648, 298),new Dollar.Point(651, 295),new Dollar.Point(652, 294),new Dollar.Point(654, 292),new Dollar.Point(657, 290),new Dollar.Point(658, 289),new Dollar.Point(658, 287),new Dollar.Point(659, 286),new Dollar.Point(659, 285),new Dollar.Point(659, 284),new Dollar.Point(660, 282),new Dollar.Point(660, 280),new Dollar.Point(661, 278),new Dollar.Point(662, 276),new Dollar.Point(662, 275),new Dollar.Point(662, 274),new Dollar.Point(662, 273),new Dollar.Point(662, 272),new Dollar.Point(662, 271),new Dollar.Point(662, 269),new Dollar.Point(662, 268)));
  	this.Templates[4] = new Template("m", new Array(new Dollar.Point(379, 141),new Dollar.Point(379, 149),new Dollar.Point(379, 160),new Dollar.Point(379, 183),new Dollar.Point(379, 200),new Dollar.Point(379, 217),new Dollar.Point(379, 232),new Dollar.Point(379, 239),new Dollar.Point(379, 244),new Dollar.Point(379, 247),new Dollar.Point(379, 251),new Dollar.Point(379, 254),new Dollar.Point(379, 256),new Dollar.Point(379, 258),new Dollar.Point(379, 260),new Dollar.Point(379, 261),new Dollar.Point(378, 261),new Dollar.Point(378, 258),new Dollar.Point(375, 248),new Dollar.Point(373, 230),new Dollar.Point(373, 204),new Dollar.Point(373, 169),new Dollar.Point(373, 141),new Dollar.Point(373, 128),new Dollar.Point(375, 117),new Dollar.Point(378, 112),new Dollar.Point(379, 110),new Dollar.Point(383, 109),new Dollar.Point(392, 107),new Dollar.Point(407, 101),new Dollar.Point(428, 94),new Dollar.Point(441, 89),new Dollar.Point(454, 86),new Dollar.Point(461, 85),new Dollar.Point(464, 85),new Dollar.Point(465, 85),new Dollar.Point(466, 87),new Dollar.Point(468, 92),new Dollar.Point(469, 100),new Dollar.Point(476, 120),new Dollar.Point(485, 149),new Dollar.Point(492, 173),new Dollar.Point(498, 197),new Dollar.Point(500, 207),new Dollar.Point(502, 218),new Dollar.Point(504, 225),new Dollar.Point(504, 228),new Dollar.Point(505, 230),new Dollar.Point(505, 231),new Dollar.Point(505, 230),new Dollar.Point(504, 225),new Dollar.Point(501, 208),new Dollar.Point(500, 171),new Dollar.Point(500, 141),new Dollar.Point(498, 105),new Dollar.Point(498, 79),new Dollar.Point(498, 66),new Dollar.Point(498, 58),new Dollar.Point(498, 54),new Dollar.Point(498, 51),new Dollar.Point(498, 49),new Dollar.Point(501, 46),new Dollar.Point(507, 40),new Dollar.Point(519, 30),new Dollar.Point(665, 50),new Dollar.Point(673, 70),new Dollar.Point(679, 88),new Dollar.Point(686, 108),new Dollar.Point(689, 120),new Dollar.Point(691, 134),new Dollar.Point(692, 143),new Dollar.Point(693, 149),new Dollar.Point(693, 155),new Dollar.Point(693, 159),new Dollar.Point(693, 162),new Dollar.Point(693, 168),new Dollar.Point(693, 176),new Dollar.Point(693, 183),new Dollar.Point(693, 191),new Dollar.Point(693, 197),new Dollar.Point(693, 200),new Dollar.Point(693, 203),new Dollar.Point(693, 204),new Dollar.Point(693, 206),new Dollar.Point(693, 207),new Dollar.Point(693, 209),new Dollar.Point(693, 211),new Dollar.Point(693, 212),new Dollar.Point(693, 214),new Dollar.Point(693, 217),new Dollar.Point(693, 219),new Dollar.Point(693, 223),new Dollar.Point(693, 225),new Dollar.Point(693, 227),new Dollar.Point(694, 229),new Dollar.Point(694, 231),new Dollar.Point(694, 232),new Dollar.Point(694, 233)));
  	this.Templates[5] = new Template("ㄅ", new Array(new Dollar.Point(565, 71),new Dollar.Point(560, 71),new Dollar.Point(555, 72),new Dollar.Point(548, 77),new Dollar.Point(536, 82),new Dollar.Point(518, 90),new Dollar.Point(494, 109),new Dollar.Point(479, 120),new Dollar.Point(462, 135),new Dollar.Point(454, 142),new Dollar.Point(446, 149),new Dollar.Point(440, 155),new Dollar.Point(436, 158),new Dollar.Point(433, 161),new Dollar.Point(431, 163),new Dollar.Point(430, 164),new Dollar.Point(429, 165),new Dollar.Point(430, 165),new Dollar.Point(433, 165),new Dollar.Point(441, 165),new Dollar.Point(460, 163),new Dollar.Point(493, 157),new Dollar.Point(548, 149),new Dollar.Point(613, 140),new Dollar.Point(654, 134),new Dollar.Point(679, 131),new Dollar.Point(694, 131),new Dollar.Point(701, 131),new Dollar.Point(705, 131),new Dollar.Point(707, 131),new Dollar.Point(708, 132),new Dollar.Point(708, 133),new Dollar.Point(709, 135),new Dollar.Point(711, 139),new Dollar.Point(712, 147),new Dollar.Point(715, 161),new Dollar.Point(718, 176),new Dollar.Point(720, 190),new Dollar.Point(723, 203),new Dollar.Point(724, 217),new Dollar.Point(725, 227),new Dollar.Point(725, 237),new Dollar.Point(725, 252),new Dollar.Point(725, 264),new Dollar.Point(725, 275),new Dollar.Point(725, 287),new Dollar.Point(725, 296),new Dollar.Point(725, 305),new Dollar.Point(725, 310),new Dollar.Point(725, 313),new Dollar.Point(725, 316),new Dollar.Point(724, 318),new Dollar.Point(724, 320),new Dollar.Point(724, 322),new Dollar.Point(724, 323),new Dollar.Point(723, 324),new Dollar.Point(723, 325),new Dollar.Point(723, 326),new Dollar.Point(723, 327),new Dollar.Point(722, 328),new Dollar.Point(722, 329),new Dollar.Point(722, 330),new Dollar.Point(721, 330),new Dollar.Point(720, 330),new Dollar.Point(719, 330),new Dollar.Point(718, 330),new Dollar.Point(717, 330),new Dollar.Point(715, 330),new Dollar.Point(711, 330),new Dollar.Point(706, 327),new Dollar.Point(699, 325),new Dollar.Point(693, 323),new Dollar.Point(687, 321),new Dollar.Point(680, 319),new Dollar.Point(676, 317),new Dollar.Point(672, 316),new Dollar.Point(669, 315),new Dollar.Point(667, 312),new Dollar.Point(665, 311),new Dollar.Point(663, 310),new Dollar.Point(661, 309),new Dollar.Point(658, 308),new Dollar.Point(657, 308),new Dollar.Point(656, 307)));
  	this.Templates[6] = new Template("✨", new Array(new Dollar.Point(75,250),new Dollar.Point(75,247),new Dollar.Point(77,244),new Dollar.Point(78,242),new Dollar.Point(79,239),new Dollar.Point(80,237),new Dollar.Point(82,234),new Dollar.Point(82,232),new Dollar.Point(84,229),new Dollar.Point(85,225),new Dollar.Point(87,222),new Dollar.Point(88,219),new Dollar.Point(89,216),new Dollar.Point(91,212),new Dollar.Point(92,208),new Dollar.Point(94,204),new Dollar.Point(95,201),new Dollar.Point(96,196),new Dollar.Point(97,194),new Dollar.Point(98,191),new Dollar.Point(100,185),new Dollar.Point(102,178),new Dollar.Point(104,173),new Dollar.Point(104,171),new Dollar.Point(105,164),new Dollar.Point(106,158),new Dollar.Point(107,156),new Dollar.Point(107,152),new Dollar.Point(108,145),new Dollar.Point(109,141),new Dollar.Point(110,139),new Dollar.Point(112,133),new Dollar.Point(113,131),new Dollar.Point(116,127),new Dollar.Point(117,125),new Dollar.Point(119,122),new Dollar.Point(121,121),new Dollar.Point(123,120),new Dollar.Point(125,122),new Dollar.Point(125,125),new Dollar.Point(127,130),new Dollar.Point(128,133),new Dollar.Point(131,143),new Dollar.Point(136,153),new Dollar.Point(140,163),new Dollar.Point(144,172),new Dollar.Point(145,175),new Dollar.Point(151,189),new Dollar.Point(156,201),new Dollar.Point(161,213),new Dollar.Point(166,225),new Dollar.Point(169,233),new Dollar.Point(171,236),new Dollar.Point(174,243),new Dollar.Point(177,247),new Dollar.Point(178,249),new Dollar.Point(179,251),new Dollar.Point(180,253),new Dollar.Point(180,255),new Dollar.Point(179,257),new Dollar.Point(177,257),new Dollar.Point(174,255),new Dollar.Point(169,250),new Dollar.Point(164,247),new Dollar.Point(160,245),new Dollar.Point(149,238),new Dollar.Point(138,230),new Dollar.Point(127,221),new Dollar.Point(124,220),new Dollar.Point(112,212),new Dollar.Point(110,210),new Dollar.Point(96,201),new Dollar.Point(84,195),new Dollar.Point(74,190),new Dollar.Point(64,182),new Dollar.Point(55,175),new Dollar.Point(51,172),new Dollar.Point(49,170),new Dollar.Point(51,169),new Dollar.Point(56,169),new Dollar.Point(66,169),new Dollar.Point(78,168),new Dollar.Point(92,166),new Dollar.Point(107,164),new Dollar.Point(123,161),new Dollar.Point(140,162),new Dollar.Point(156,162),new Dollar.Point(171,160),new Dollar.Point(173,160),new Dollar.Point(186,160),new Dollar.Point(195,160),new Dollar.Point(198,161),new Dollar.Point(203,163),new Dollar.Point(208,163),new Dollar.Point(206,164),new Dollar.Point(200,167),new Dollar.Point(187,172),new Dollar.Point(174,179),new Dollar.Point(172,181),new Dollar.Point(153,192),new Dollar.Point(137,201),new Dollar.Point(123,211),new Dollar.Point(112,220),new Dollar.Point(99,229),new Dollar.Point(90,237),new Dollar.Point(80,244),new Dollar.Point(73,250),new Dollar.Point(69,254),new Dollar.Point(69,252)));
    // this.Templates[6] = new Template("海波浪", new Array(new Dollar.Point(307,216),new Dollar.Point(333,186),new Dollar.Point(356,215),new Dollar.Point(375,186),new Dollar.Point(399,216),new Dollar.Point(418,186)));
  	// this.Templates[7] = new Template("指向", new Array(new Dollar.Point(68,222),new Dollar.Point(70,220),new Dollar.Point(73,218),new Dollar.Point(75,217),new Dollar.Point(77,215),new Dollar.Point(80,213),new Dollar.Point(82,212),new Dollar.Point(84,210),new Dollar.Point(87,209),new Dollar.Point(89,208),new Dollar.Point(92,206),new Dollar.Point(95,204),new Dollar.Point(101,201),new Dollar.Point(106,198),new Dollar.Point(112,194),new Dollar.Point(118,191),new Dollar.Point(124,187),new Dollar.Point(127,186),new Dollar.Point(132,183),new Dollar.Point(138,181),new Dollar.Point(141,180),new Dollar.Point(146,178),new Dollar.Point(154,173),new Dollar.Point(159,171),new Dollar.Point(161,170),new Dollar.Point(166,167),new Dollar.Point(168,167),new Dollar.Point(171,166),new Dollar.Point(174,164),new Dollar.Point(177,162),new Dollar.Point(180,160),new Dollar.Point(182,158),new Dollar.Point(183,156),new Dollar.Point(181,154),new Dollar.Point(178,153),new Dollar.Point(171,153),new Dollar.Point(164,153),new Dollar.Point(160,153),new Dollar.Point(150,154),new Dollar.Point(147,155),new Dollar.Point(141,157),new Dollar.Point(137,158),new Dollar.Point(135,158),new Dollar.Point(137,158),new Dollar.Point(140,157),new Dollar.Point(143,156),new Dollar.Point(151,154),new Dollar.Point(160,152),new Dollar.Point(170,149),new Dollar.Point(179,147),new Dollar.Point(185,145),new Dollar.Point(192,144),new Dollar.Point(196,144),new Dollar.Point(198,144),new Dollar.Point(200,144),new Dollar.Point(201,147),new Dollar.Point(199,149),new Dollar.Point(194,157),new Dollar.Point(191,160),new Dollar.Point(186,167),new Dollar.Point(180,176),new Dollar.Point(177,179),new Dollar.Point(171,187),new Dollar.Point(169,189),new Dollar.Point(165,194),new Dollar.Point(164,196)));
  	// this.Templates[8] = new Template("正方形的左半邊", new Array(new Dollar.Point(140,124),new Dollar.Point(138,123),new Dollar.Point(135,122),new Dollar.Point(133,123),new Dollar.Point(130,123),new Dollar.Point(128,124),new Dollar.Point(125,125),new Dollar.Point(122,124),new Dollar.Point(120,124),new Dollar.Point(118,124),new Dollar.Point(116,125),new Dollar.Point(113,125),new Dollar.Point(111,125),new Dollar.Point(108,124),new Dollar.Point(106,125),new Dollar.Point(104,125),new Dollar.Point(102,124),new Dollar.Point(100,123),new Dollar.Point(98,123),new Dollar.Point(95,124),new Dollar.Point(93,123),new Dollar.Point(90,124),new Dollar.Point(88,124),new Dollar.Point(85,125),new Dollar.Point(83,126),new Dollar.Point(81,127),new Dollar.Point(81,129),new Dollar.Point(82,131),new Dollar.Point(82,134),new Dollar.Point(83,138),new Dollar.Point(84,141),new Dollar.Point(84,144),new Dollar.Point(85,148),new Dollar.Point(85,151),new Dollar.Point(86,156),new Dollar.Point(86,160),new Dollar.Point(86,164),new Dollar.Point(86,168),new Dollar.Point(87,171),new Dollar.Point(87,175),new Dollar.Point(87,179),new Dollar.Point(87,182),new Dollar.Point(87,186),new Dollar.Point(88,188),new Dollar.Point(88,195),new Dollar.Point(88,198),new Dollar.Point(88,201),new Dollar.Point(88,207),new Dollar.Point(89,211),new Dollar.Point(89,213),new Dollar.Point(89,217),new Dollar.Point(89,222),new Dollar.Point(88,225),new Dollar.Point(88,229),new Dollar.Point(88,231),new Dollar.Point(88,233),new Dollar.Point(88,235),new Dollar.Point(89,237),new Dollar.Point(89,240),new Dollar.Point(89,242),new Dollar.Point(91,241),new Dollar.Point(94,241),new Dollar.Point(96,240),new Dollar.Point(98,239),new Dollar.Point(105,240),new Dollar.Point(109,240),new Dollar.Point(113,239),new Dollar.Point(116,240),new Dollar.Point(121,239),new Dollar.Point(130,240),new Dollar.Point(136,237),new Dollar.Point(139,237),new Dollar.Point(144,238),new Dollar.Point(151,237),new Dollar.Point(157,236),new Dollar.Point(159,237)));
  	// this.Templates[9] = new Template("正方形的右半邊", new Array(new Dollar.Point(112,138),new Dollar.Point(112,136),new Dollar.Point(115,136),new Dollar.Point(118,137),new Dollar.Point(120,136),new Dollar.Point(123,136),new Dollar.Point(125,136),new Dollar.Point(128,136),new Dollar.Point(131,136),new Dollar.Point(134,135),new Dollar.Point(137,135),new Dollar.Point(140,134),new Dollar.Point(143,133),new Dollar.Point(145,132),new Dollar.Point(147,132),new Dollar.Point(149,132),new Dollar.Point(152,132),new Dollar.Point(153,134),new Dollar.Point(154,137),new Dollar.Point(155,141),new Dollar.Point(156,144),new Dollar.Point(157,152),new Dollar.Point(158,161),new Dollar.Point(160,170),new Dollar.Point(162,182),new Dollar.Point(164,192),new Dollar.Point(166,200),new Dollar.Point(167,209),new Dollar.Point(168,214),new Dollar.Point(168,216),new Dollar.Point(169,221),new Dollar.Point(169,223),new Dollar.Point(169,228),new Dollar.Point(169,231),new Dollar.Point(166,233),new Dollar.Point(164,234),new Dollar.Point(161,235),new Dollar.Point(155,236),new Dollar.Point(147,235),new Dollar.Point(140,233),new Dollar.Point(131,233),new Dollar.Point(124,233),new Dollar.Point(117,235),new Dollar.Point(114,238),new Dollar.Point(112,238)));
  	// this.Templates[10] = new Template("長長(V)", new Array(new Dollar.Point(89,164),new Dollar.Point(90,162),new Dollar.Point(92,162),new Dollar.Point(94,164),new Dollar.Point(95,166),new Dollar.Point(96,169),new Dollar.Point(97,171),new Dollar.Point(99,175),new Dollar.Point(101,178),new Dollar.Point(103,182),new Dollar.Point(106,189),new Dollar.Point(108,194),new Dollar.Point(111,199),new Dollar.Point(114,204),new Dollar.Point(117,209),new Dollar.Point(119,214),new Dollar.Point(122,218),new Dollar.Point(124,222),new Dollar.Point(126,225),new Dollar.Point(128,228),new Dollar.Point(130,229),new Dollar.Point(133,233),new Dollar.Point(134,236),new Dollar.Point(136,239),new Dollar.Point(138,240),new Dollar.Point(139,242),new Dollar.Point(140,244),new Dollar.Point(142,242),new Dollar.Point(142,240),new Dollar.Point(142,237),new Dollar.Point(143,235),new Dollar.Point(143,233),new Dollar.Point(145,229),new Dollar.Point(146,226),new Dollar.Point(148,217),new Dollar.Point(149,208),new Dollar.Point(149,205),new Dollar.Point(151,196),new Dollar.Point(151,193),new Dollar.Point(153,182),new Dollar.Point(155,172),new Dollar.Point(157,165),new Dollar.Point(159,160),new Dollar.Point(162,155),new Dollar.Point(164,150),new Dollar.Point(165,148),new Dollar.Point(166,146)));
  	// this.Templates[11] = new Template("莫名其妙的delete", new Array(new Dollar.Point(123,129),new Dollar.Point(123,131),new Dollar.Point(124,133),new Dollar.Point(125,136),new Dollar.Point(127,140),new Dollar.Point(129,142),new Dollar.Point(133,148),new Dollar.Point(137,154),new Dollar.Point(143,158),new Dollar.Point(145,161),new Dollar.Point(148,164),new Dollar.Point(153,170),new Dollar.Point(158,176),new Dollar.Point(160,178),new Dollar.Point(164,183),new Dollar.Point(168,188),new Dollar.Point(171,191),new Dollar.Point(175,196),new Dollar.Point(178,200),new Dollar.Point(180,202),new Dollar.Point(181,205),new Dollar.Point(184,208),new Dollar.Point(186,210),new Dollar.Point(187,213),new Dollar.Point(188,215),new Dollar.Point(186,212),new Dollar.Point(183,211),new Dollar.Point(177,208),new Dollar.Point(169,206),new Dollar.Point(162,205),new Dollar.Point(154,207),new Dollar.Point(145,209),new Dollar.Point(137,210),new Dollar.Point(129,214),new Dollar.Point(122,217),new Dollar.Point(118,218),new Dollar.Point(111,221),new Dollar.Point(109,222),new Dollar.Point(110,219),new Dollar.Point(112,217),new Dollar.Point(118,209),new Dollar.Point(120,207),new Dollar.Point(128,196),new Dollar.Point(135,187),new Dollar.Point(138,183),new Dollar.Point(148,167),new Dollar.Point(157,153),new Dollar.Point(163,145),new Dollar.Point(165,142),new Dollar.Point(172,133),new Dollar.Point(177,127),new Dollar.Point(179,127),new Dollar.Point(180,125)));
  	// this.Templates[12] = new Template("左波浪", new Array(new Dollar.Point(150,116),new Dollar.Point(147,117),new Dollar.Point(145,116),new Dollar.Point(142,116),new Dollar.Point(139,117),new Dollar.Point(136,117),new Dollar.Point(133,118),new Dollar.Point(129,121),new Dollar.Point(126,122),new Dollar.Point(123,123),new Dollar.Point(120,125),new Dollar.Point(118,127),new Dollar.Point(115,128),new Dollar.Point(113,129),new Dollar.Point(112,131),new Dollar.Point(113,134),new Dollar.Point(115,134),new Dollar.Point(117,135),new Dollar.Point(120,135),new Dollar.Point(123,137),new Dollar.Point(126,138),new Dollar.Point(129,140),new Dollar.Point(135,143),new Dollar.Point(137,144),new Dollar.Point(139,147),new Dollar.Point(141,149),new Dollar.Point(140,152),new Dollar.Point(139,155),new Dollar.Point(134,159),new Dollar.Point(131,161),new Dollar.Point(124,166),new Dollar.Point(121,166),new Dollar.Point(117,166),new Dollar.Point(114,167),new Dollar.Point(112,166),new Dollar.Point(114,164),new Dollar.Point(116,163),new Dollar.Point(118,163),new Dollar.Point(120,162),new Dollar.Point(122,163),new Dollar.Point(125,164),new Dollar.Point(127,165),new Dollar.Point(129,166),new Dollar.Point(130,168),new Dollar.Point(129,171),new Dollar.Point(127,175),new Dollar.Point(125,179),new Dollar.Point(123,184),new Dollar.Point(121,190),new Dollar.Point(120,194),new Dollar.Point(119,199),new Dollar.Point(120,202),new Dollar.Point(123,207),new Dollar.Point(127,211),new Dollar.Point(133,215),new Dollar.Point(142,219),new Dollar.Point(148,220),new Dollar.Point(151,221)));
  	// this.Templates[13] = new Template("又波浪", new Array(new Dollar.Point(117,132),new Dollar.Point(115,132),new Dollar.Point(115,129),new Dollar.Point(117,129),new Dollar.Point(119,128),new Dollar.Point(122,127),new Dollar.Point(125,127),new Dollar.Point(127,127),new Dollar.Point(130,127),new Dollar.Point(133,129),new Dollar.Point(136,129),new Dollar.Point(138,130),new Dollar.Point(140,131),new Dollar.Point(143,134),new Dollar.Point(144,136),new Dollar.Point(145,139),new Dollar.Point(145,142),new Dollar.Point(145,145),new Dollar.Point(145,147),new Dollar.Point(145,149),new Dollar.Point(144,152),new Dollar.Point(142,157),new Dollar.Point(141,160),new Dollar.Point(139,163),new Dollar.Point(137,166),new Dollar.Point(135,167),new Dollar.Point(133,169),new Dollar.Point(131,172),new Dollar.Point(128,173),new Dollar.Point(126,176),new Dollar.Point(125,178),new Dollar.Point(125,180),new Dollar.Point(125,182),new Dollar.Point(126,184),new Dollar.Point(128,187),new Dollar.Point(130,187),new Dollar.Point(132,188),new Dollar.Point(135,189),new Dollar.Point(140,189),new Dollar.Point(145,189),new Dollar.Point(150,187),new Dollar.Point(155,186),new Dollar.Point(157,185),new Dollar.Point(159,184),new Dollar.Point(156,185),new Dollar.Point(154,185),new Dollar.Point(149,185),new Dollar.Point(145,187),new Dollar.Point(141,188),new Dollar.Point(136,191),new Dollar.Point(134,191),new Dollar.Point(131,192),new Dollar.Point(129,193),new Dollar.Point(129,195),new Dollar.Point(129,197),new Dollar.Point(131,200),new Dollar.Point(133,202),new Dollar.Point(136,206),new Dollar.Point(139,211),new Dollar.Point(142,215),new Dollar.Point(145,220),new Dollar.Point(147,225),new Dollar.Point(148,231),new Dollar.Point(147,239),new Dollar.Point(144,244),new Dollar.Point(139,248),new Dollar.Point(134,250),new Dollar.Point(126,253),new Dollar.Point(119,253),new Dollar.Point(115,253)));
  	// this.Templates[14] = new Template("✨", new Array(new Dollar.Point(75,250),new Dollar.Point(75,247),new Dollar.Point(77,244),new Dollar.Point(78,242),new Dollar.Point(79,239),new Dollar.Point(80,237),new Dollar.Point(82,234),new Dollar.Point(82,232),new Dollar.Point(84,229),new Dollar.Point(85,225),new Dollar.Point(87,222),new Dollar.Point(88,219),new Dollar.Point(89,216),new Dollar.Point(91,212),new Dollar.Point(92,208),new Dollar.Point(94,204),new Dollar.Point(95,201),new Dollar.Point(96,196),new Dollar.Point(97,194),new Dollar.Point(98,191),new Dollar.Point(100,185),new Dollar.Point(102,178),new Dollar.Point(104,173),new Dollar.Point(104,171),new Dollar.Point(105,164),new Dollar.Point(106,158),new Dollar.Point(107,156),new Dollar.Point(107,152),new Dollar.Point(108,145),new Dollar.Point(109,141),new Dollar.Point(110,139),new Dollar.Point(112,133),new Dollar.Point(113,131),new Dollar.Point(116,127),new Dollar.Point(117,125),new Dollar.Point(119,122),new Dollar.Point(121,121),new Dollar.Point(123,120),new Dollar.Point(125,122),new Dollar.Point(125,125),new Dollar.Point(127,130),new Dollar.Point(128,133),new Dollar.Point(131,143),new Dollar.Point(136,153),new Dollar.Point(140,163),new Dollar.Point(144,172),new Dollar.Point(145,175),new Dollar.Point(151,189),new Dollar.Point(156,201),new Dollar.Point(161,213),new Dollar.Point(166,225),new Dollar.Point(169,233),new Dollar.Point(171,236),new Dollar.Point(174,243),new Dollar.Point(177,247),new Dollar.Point(178,249),new Dollar.Point(179,251),new Dollar.Point(180,253),new Dollar.Point(180,255),new Dollar.Point(179,257),new Dollar.Point(177,257),new Dollar.Point(174,255),new Dollar.Point(169,250),new Dollar.Point(164,247),new Dollar.Point(160,245),new Dollar.Point(149,238),new Dollar.Point(138,230),new Dollar.Point(127,221),new Dollar.Point(124,220),new Dollar.Point(112,212),new Dollar.Point(110,210),new Dollar.Point(96,201),new Dollar.Point(84,195),new Dollar.Point(74,190),new Dollar.Point(64,182),new Dollar.Point(55,175),new Dollar.Point(51,172),new Dollar.Point(49,170),new Dollar.Point(51,169),new Dollar.Point(56,169),new Dollar.Point(66,169),new Dollar.Point(78,168),new Dollar.Point(92,166),new Dollar.Point(107,164),new Dollar.Point(123,161),new Dollar.Point(140,162),new Dollar.Point(156,162),new Dollar.Point(171,160),new Dollar.Point(173,160),new Dollar.Point(186,160),new Dollar.Point(195,160),new Dollar.Point(198,161),new Dollar.Point(203,163),new Dollar.Point(208,163),new Dollar.Point(206,164),new Dollar.Point(200,167),new Dollar.Point(187,172),new Dollar.Point(174,179),new Dollar.Point(172,181),new Dollar.Point(153,192),new Dollar.Point(137,201),new Dollar.Point(123,211),new Dollar.Point(112,220),new Dollar.Point(99,229),new Dollar.Point(90,237),new Dollar.Point(80,244),new Dollar.Point(73,250),new Dollar.Point(69,254),new Dollar.Point(69,252)));
  	// this.Templates[15] = new Template("自以為的豬尾巴", new Array(new Dollar.Point(81,219),new Dollar.Point(84,218),new Dollar.Point(86,220),new Dollar.Point(88,220),new Dollar.Point(90,220),new Dollar.Point(92,219),new Dollar.Point(95,220),new Dollar.Point(97,219),new Dollar.Point(99,220),new Dollar.Point(102,218),new Dollar.Point(105,217),new Dollar.Point(107,216),new Dollar.Point(110,216),new Dollar.Point(113,214),new Dollar.Point(116,212),new Dollar.Point(118,210),new Dollar.Point(121,208),new Dollar.Point(124,205),new Dollar.Point(126,202),new Dollar.Point(129,199),new Dollar.Point(132,196),new Dollar.Point(136,191),new Dollar.Point(139,187),new Dollar.Point(142,182),new Dollar.Point(144,179),new Dollar.Point(146,174),new Dollar.Point(148,170),new Dollar.Point(149,168),new Dollar.Point(151,162),new Dollar.Point(152,160),new Dollar.Point(152,157),new Dollar.Point(152,155),new Dollar.Point(152,151),new Dollar.Point(152,149),new Dollar.Point(152,146),new Dollar.Point(149,142),new Dollar.Point(148,139),new Dollar.Point(145,137),new Dollar.Point(141,135),new Dollar.Point(139,135),new Dollar.Point(134,136),new Dollar.Point(130,140),new Dollar.Point(128,142),new Dollar.Point(126,145),new Dollar.Point(122,150),new Dollar.Point(119,158),new Dollar.Point(117,163),new Dollar.Point(115,170),new Dollar.Point(114,175),new Dollar.Point(117,184),new Dollar.Point(120,190),new Dollar.Point(125,199),new Dollar.Point(129,203),new Dollar.Point(133,208),new Dollar.Point(138,213),new Dollar.Point(145,215),new Dollar.Point(155,218),new Dollar.Point(164,219),new Dollar.Point(166,219),new Dollar.Point(177,219),new Dollar.Point(182,218),new Dollar.Point(192,216),new Dollar.Point(196,213),new Dollar.Point(199,212),new Dollar.Point(201,211)));
    //
  	// The $1 Gesture Recognizer API begins here -- 3 methods
  	//
  	this.Recognize = function(points, useProtractor)
  	{
  		points = Resample(points, NumPoints);
  		var radians = IndicativeAngle(points);
  		points = RotateBy(points, -radians);
  		points = ScaleTo(points, SquareSize);
  		points = TranslateTo(points, Origin);
  		var vector = Vectorize(points); // for Protractor

  		var b = +Infinity;
  		var t = 0;
  		for (var i = 0; i < this.Templates.length; i++) // for each unistroke template
  		{
  			var d;
  			if (useProtractor) // for Protractor
  			{
  				d = OptimalCosineDistance(this.Templates[i].Vector, vector);
  			}
  			else // Golden Section Search (original $1)
  			{
  				d = DistanceAtBestAngle(points, this.Templates[i], -AngleRange, +AngleRange, AnglePrecision);
  			}
  			if (d < b)
  			{
  				b = d; // best (least) distance
  				t = i; // unistroke template
  			}
  		}
  		return new Result(this.Templates[t].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
  	};
  	//
  	// add/delete new templates
  	//
  	this.AddTemplate = function(name, points)
  	{
  		this.Templates[this.Templates.length] = new Template(name, points); // append new template
  		var num = 0;
  		for (var i = 0; i < this.Templates.length; i++)
  		{
  			if (this.Templates[i].Name == name)
  				num++;
  		}
  		return num;
  	}
  	this.DeleteUserTemplates = function()
  	{
  		this.Templates.length = NumTemplates; // clear any beyond the original set
  		return NumTemplates;
  	}
  }
  //
  // Private helper functions from this point down
  //
  function Resample(points, n)
  {
  	var I = PathLength(points) / (n - 1); // interval length
  	var D = 0.0;
  	var newpoints = new Array(points[0]);
  	for (var i = 1; i < points.length; i++)
  	{
  		var d = Distance(points[i - 1], points[i]);
  		if ((D + d) >= I)
  		{
  			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
  			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
  			var q = new Dollar.Point(qx, qy);
  			newpoints[newpoints.length] = q; // append new point 'q'
  			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
  			D = 0.0;
  		}
  		else D += d;
  	}
  	// somtimes we fall a rounding-error short of adding the last point, so add it if so
  	if (newpoints.length == n - 1)
  	{
  		newpoints[newpoints.length] = new Dollar.Point(points[points.length - 1].X, points[points.length - 1].Y);
  	}
  	return newpoints;
  }
  function IndicativeAngle(points)
  {
  	var c = Centroid(points);
  	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
  }	
  function RotateBy(points, radians) // rotates points around centroid
  {
  	var c = Centroid(points);
  	var cos = Math.cos(radians);
  	var sin = Math.sin(radians);

  	var newpoints = new Array();
  	for (var i = 0; i < points.length; i++)
  	{
  		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
  		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
  		newpoints[newpoints.length] = new Dollar.Point(qx, qy);
  	}
  	return newpoints;
  }
  function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
  {
  	var B = BoundingBox(points);
  	var newpoints = new Array();
  	for (var i = 0; i < points.length; i++)
  	{
  		var qx = points[i].X * (size / B.Width);
  		var qy = points[i].Y * (size / B.Height);
  		newpoints[newpoints.length] = new Dollar.Point(qx, qy);
  	}
  	return newpoints;
  }			
  function TranslateTo(points, pt) // translates points' centroid
  {
  	var c = Centroid(points);
  	var newpoints = new Array();
  	for (var i = 0; i < points.length; i++)
  	{
  		var qx = points[i].X + pt.X - c.X;
  		var qy = points[i].Y + pt.Y - c.Y;
  		newpoints[newpoints.length] = new Dollar.Point(qx, qy);
  	}
  	return newpoints;
  }
  function Vectorize(points) // for Protractor
  {
  	var sum = 0.0;
  	var vector = new Array();
  	for (var i = 0; i < points.length; i++)
  	{
  		vector[vector.length] = points[i].X;
  		vector[vector.length] = points[i].Y;
  		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
  	}
  	var magnitude = Math.sqrt(sum);
  	for (var i = 0; i < vector.length; i++)
  		vector[i] /= magnitude;
  	return vector;
  }
  function OptimalCosineDistance(v1, v2) // for Protractor
  {
  	var a = 0.0;
  	var b = 0.0;
  	for (var i = 0; i < v1.length; i += 2)
  	{
  		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                  b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
  	}
  	var angle = Math.atan(b / a);
  	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
  }
  function DistanceAtBestAngle(points, T, a, b, threshold)
  {
  	var x1 = Phi * a + (1.0 - Phi) * b;
  	var f1 = DistanceAtAngle(points, T, x1);
  	var x2 = (1.0 - Phi) * a + Phi * b;
  	var f2 = DistanceAtAngle(points, T, x2);
  	while (Math.abs(b - a) > threshold)
  	{
  		if (f1 < f2)
  		{
  			b = x2;
  			x2 = x1;
  			f2 = f1;
  			x1 = Phi * a + (1.0 - Phi) * b;
  			f1 = DistanceAtAngle(points, T, x1);
  		}
  		else
  		{
  			a = x1;
  			x1 = x2;
  			f1 = f2;
  			x2 = (1.0 - Phi) * a + Phi * b;
  			f2 = DistanceAtAngle(points, T, x2);
  		}
  	}
  	return Math.min(f1, f2);
  }			
  function DistanceAtAngle(points, T, radians)
  {
  	var newpoints = RotateBy(points, radians);
  	return PathDistance(newpoints, T.Points);
  }	
  function Centroid(points)
  {
  	var x = 0.0, y = 0.0;
  	for (var i = 0; i < points.length; i++)
  	{
  		x += points[i].X;
  		y += points[i].Y;
  	}
  	x /= points.length;
  	y /= points.length;
  	return new Dollar.Point(x, y);
  }	
  function BoundingBox(points)
  {
  	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
  	for (var i = 0; i < points.length; i++)
  	{
  		if (points[i].X < minX)
  			minX = points[i].X;
  		if (points[i].X > maxX)
  			maxX = points[i].X;
  		if (points[i].Y < minY)
  			minY = points[i].Y;
  		if (points[i].Y > maxY)
  			maxY = points[i].Y;
  	}
  	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
  }	
  function PathDistance(pts1, pts2)
  {
  	var d = 0.0;
  	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
  		d += Distance(pts1[i], pts2[i]);
  	return d / pts1.length;
  }
  function PathLength(points)
  {
  	var d = 0.0;
  	for (var i = 1; i < points.length; i++)
  		d += Distance(points[i - 1], points[i]);
  	return d;
  }		
  function Distance(p1, p2)
  {
  	var dx = p2.X - p1.X;
  	var dy = p2.Y - p1.Y;
  	return Math.sqrt(dx * dx + dy * dy);
  }
  function Deg2Rad(d) { return (d * Math.PI / 180.0); }
  function Rad2Deg(r) { return (r * 180.0 / Math.PI); }
  
})();

