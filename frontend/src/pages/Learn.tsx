import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, MessageSquare, Lock, QrCode, Globe, KeyRound, Users, Eye, UserCheck, Link, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap: Record<string, typeof Mail> = { Mail, MessageSquare, Lock, QrCode, Globe, KeyRound, Users, Eye, UserCheck, Link };

interface Topic { id: string; titleEn: string; titleUr: string; icon: string; whatIsEn: string; whatIsUr: string; whyEn: string; whyUr: string; signsEn: string[]; signsUr: string[]; exampleEn: string; exampleUr: string; doEn: string[]; doUr: string[]; dontEn: string[]; dontUr: string[]; }

const topics: Topic[] = [
  { id: 'phishing', titleEn: 'Phishing', titleUr: 'فشنگ', icon: 'Mail',
    whatIsEn: 'Phishing is a cyberattack where criminals send fake emails pretending to be from trusted organizations to steal your personal information.',
    whatIsUr: 'فشنگ ایک سائبر حملہ ہے جس میں مجرم آپ کی ذاتی معلومات چوری کرنے کے لیے بھروسہ مند اداروں کی ناک پر فیک ای میلز بھیجتے ہیں۔',
    whyEn: 'Phishing can steal your passwords, credit card numbers, and identity.', whyUr: 'فشنگ آپ کے پاس ورڈز، کریڈٹ کارڈ نمبرز اور شناخت چوری کر سکتا ہے۔',
    signsEn: ['Urgent language or threats', 'Generic greetings like "Dear User"', 'Suspicious sender addresses', 'Requests for personal information', 'Too-good-to-be-true offers'],
    signsUr: ['فوری زبان یا دھمکیاں', 'عام سلام جیسے "پیارے صارف"', 'مشکوک بھیجنے والا پتہ', 'ذاتی معلومات کی درخواستیں', 'بہت اچھے offers جو سچ نہیں لگتے'],
    exampleEn: '"URGENT: Your bank account has been compromised. Click here to verify your identity immediately or your account will be suspended."', exampleUr: '"فوری: آپ کا بینک اکاؤنٹ خطرے میں ہے۔ فوری طور پر اپنی شناخت کی تصدیق کریں ورنہ آپ کا اکاؤنٹ بند کر دیا جائے گا۔"',
    doEn: ['Verify the sender email carefully', 'Go directly to the organization website', 'Report suspicious emails to your provider'],
    doUr: ['بھیجنے والا ای میل محتاطی سے چیک کریں', 'براہ راست ادارے کی ویب سائٹ پر جائیں', 'مشکوک ای میلز اپنے پروائیڈر کو رپورٹ کریں'],
    dontEn: ['Never click links in suspicious emails', 'Never provide personal information', 'Never open unexpected attachments'],
    dontUr: ['کبھی مشکوک ای میلز میں لنکس نہ کلک کریں', 'کبھی ذاتی معلومات فراہم نہ کریں', 'کبھی غیر متوقع منسلکات نہ کھولیں'] },
  { id: 'sms-scams', titleEn: 'SMS Scams', titleUr: 'ایس ایم ایس اسکیم', icon: 'MessageSquare',
    whatIsEn: 'SMS scams (smishing) are fraudulent text messages designed to trick you into revealing personal information or clicking malicious links.', whatIsUr: 'ایس ایم ایس اسکیم جعلی ٹیکسٹ پیغامات ہیں جو آپ کو ذاتی معلومات ظاہر کرنے یا خطرناک لنکس پر کلک کرنے کے لیے ڈیزائن کیے گئے ہیں۔',
    whyEn: 'Scammers can steal your money, personal data, or install malware on your phone.', whyUr: 'اسکیمرز آپ کا پیسہ، ذاتی ڈیٹا چوری کر سکتے ہیں یا آپ کے فون میں میلویئر انسٹال کر سکتے ہیں۔',
    signsEn: ['Messages about winning prizes', 'Bank alerts asking you to call', 'Delivery notifications for packages you didn\'t order', 'Requests for OTP codes', 'Urgent threats about account closure'],
    signsUr: ['انعامات جیتنے والے پیغامات', 'بول چال کی درخواست والی بینک ایالمارت', 'غیر منگائی پیکج کی ڈیلیوری اطلاعات', 'او ٹی پی کوڈز کی درخواستیں', 'اکاؤنٹ بند کرنے کی دھمکیاں'],
    exampleEn: '"Your package delivery failed. Visit http://suspicious-link.com to reschedule."', exampleUr: '"آپ کی پیکج ڈیلیوری ناکام ہو گئی۔ دوبارہ شیڈول کرنے کے لیے وزٹ کریں۔"',
    doEn: ['Do not click any links', 'Verify by contacting the organization directly', 'Block and report suspicious numbers'],
    doUr: ['کوئی لنک نہ کلک کریں', 'براہ راست ادارے سے رابطہ کر کے تصدیق کریں', 'مشکوک نمبرز بلاک اور رپورٹ کریں'],
    dontEn: ['Never share OTP codes', 'Never reply to suspicious messages', 'Never call numbers from suspicious texts'],
    dontUr: ['کبھی او ٹی پی کوڈز شیئر نہ کریں', 'کبھی مشکوک پیغامات کا جواب نہ دیں', 'کبھی مشکوک ٹیکسٹس کے نمبرز پر کال نہ کریں'] },
  { id: 'password-security', titleEn: 'Password Security', titleUr: 'پاس ورڈ کی حفاظت', icon: 'Lock',
    whatIsEn: 'Password security involves creating and managing strong passwords to protect your online accounts from unauthorized access.', whatIsUr: 'پاس ورڈ کی حفاظت میں غیر مجاز رسائی سے آپ کے آن لائن اکاؤنٹس کی حفاظت کے لیے مضبوط پاس ورڈز بنانا اور ان کا انتظام شامل ہے۔',
    whyEn: 'Weak passwords are easily guessed or cracked, giving attackers access to your accounts.', whyUr: 'کمزور پاس ورڈز آسانی سے اندازے یا توڑے جا سکتے ہیں، حملہ آورز کو آپ کے اکاؤنٹس تک رسائی دیتے ہیں۔',
    signsEn: ['Using the same password everywhere', 'Short passwords under 8 characters', 'Simple patterns like "123456"', 'Using personal information in passwords'],
    signsUr: ['ہر جگہ ایک ہی پاس ورڈ استعمال کرنا', '8 حروف سے کم مختصر پاس ورڈز', 'سادہ پیٹرنز جیسے "123456"', 'پاس ورڈز میں ذاتی معلومات استعمال کرنا'],
    exampleEn: 'Bad: "password123" — too common. Good: "Tiger$Mountain#Rain2024!" — long, mixed.', exampleUr: 'خراب: "password123" — بہت عام۔ اچھا: "Tiger$Mountain#Rain2024!" — لمبا، مخلوط۔',
    doEn: ['Use at least 12 characters', 'Mix uppercase, lowercase, numbers, symbols', 'Use a password manager', 'Enable two-factor authentication'],
    doUr: ['کم از کم 12 حروف استعمال کریں', 'بڑے، چھوٹے حروف، نمبرز، علامات ملائیں', 'پاس ورڈ مینیجر استعمال کریں', 'دو مرحلے کی تصدیق فعال کریں'],
    dontEn: ['Never reuse passwords', 'Never share passwords via email', 'Never use dictionary words alone', 'Never save passwords in plain text'],
    dontUr: ['کبھی پاس ورڈز دوبارہ استعمال نہ کریں', 'کبھی ای میل کے ذریعے پاس ورڈز شیئر نہ کریں', 'کبھی صرف لغت کے الفاظ استعمال نہ کریں', 'کبھی پاس ورڈز سادہ متن میں محفوظ نہ کریں'] },
  { id: 'qr-safety', titleEn: 'QR Code Safety', titleUr: 'کیو آر کوڈ حفاظت', icon: 'QrCode',
    whatIsEn: 'QR code safety means being cautious when scanning QR codes, as they can lead to malicious websites or download malware.', whatIsUr: 'کیو آر کوڈ حفاظت کا مطلب ہے کیو آر کوڈز اسکین کرتے وقت محتاط ہونا، کیونکہ یہ خطرناک ویب سائٹوں یا میلویئر ڈاؤنلوڈ کی طرف لے جا سکتے ہیں۔',
    whyEn: 'Malicious QR codes can redirect you to phishing sites or steal your credentials.', whyUr: 'خطرناک کیو آر کوڈز آپ کو فشنگ سائٹس پر بھیج سکتے ہیں یا آپ کی تفصیلات چوری کر سکتے ہیں۔',
    signsEn: ['QR codes in unexpected locations', 'Stickers placed over original codes', 'Codes leading to login pages', 'Codes requesting personal information'],
    signsUr: ['غیر متوقع جگہوں پر کیو آر کوڈز', 'اصل کوڈز پر لگائی گئی سٹکرز', 'لاگ ان صفحات پر لے جانے والے کوڈز', 'ذاتی معلومات کی درخواست والے کوڈز'],
    exampleEn: 'A QR code sticker placed over a restaurant\'s payment QR — redirecting payments to an attacker.', exampleUr: 'ریستوراں کی ادائیگی کیو آر پر لگائی گئی کیو آر کوڈ سٹکر — ادائیگیاں حملہ آور کو بھیج رہی ہیں۔',
    doEn: ['Preview the URL before visiting', 'Check if QR codes look tampered', 'Use built-in scanner for warnings'],
    doUr: ['_visit سے پہلے یو آر ایل پیش نظارہ کریں', 'چیک کریں کہ کیو آر کوڈ ٹھیس ہوئے تو نہیں', 'warning کے لیے بلٹ ان اسکینر استعمال کریں'],
    dontEn: ['Never scan QR codes from untrusted sources', 'Never enter credentials after scanning', 'Never make payments through unknown QR codes'],
    dontUr: ['کبھی غیر بھروسہ مند ذرائع سے کیو آر کوڈز اسکین نہ کریں', 'کبھی اسکیننگ کے بعد تفصیلات درج نہ کریں', 'کبھی نامعلوم کیو آر کوڈز سے ادائیگیاں نہ کریں'] },
  { id: 'safe-browsing', titleEn: 'Safe Browsing', titleUr: 'محفوظ براؤزنگ', icon: 'Globe',
    whatIsEn: 'Safe browsing means being cautious about which websites you visit and what information you share online.', whatIsUr: 'محفوظ براؤزنگ کا مطلب ہے کہ آپ کون سی ویب سائٹیں دیکھتے ہیں اور آن لائن کیا معلومات شیئر کرتے ہیں اس کے بارے میں محتاط ہونا۔',
    whyEn: 'Malicious websites can steal your data or trick you into making fraudulent purchases.', whyUr: 'خطرناک ویب سائٹیں آپ کا ڈیٹا چوری کر سکتی ہیں یا جعلی خریداریاں کروا سکتی ہیں۔',
    signsEn: ['No HTTPS (no padlock icon)', 'Misspelled domain names', 'Excessive pop-ups', 'Requests to disable security features'],
    signsUr: ['HTTPS نہیں (لاک آئیکون نہیں)', 'غلط ڈومین نامز', 'زیادہ پاپ اپس', 'سیکیورٹی فیچرز غیر فعال کرنے کی درخواستیں'],
    exampleEn: 'A fake banking site at "secure-bankofamerica.com.logins.xyz"', exampleUr: '"secure-bankofamerica.com.logins.xyz" پر جعلی بینکنگ سائٹ',
    doEn: ['Always check for HTTPS', 'Keep your browser updated', 'Verify website URLs carefully'],
    doUr: ['ہمیشہ HTTPS چیک کریں', 'اپنا براؤزر اپ ڈیٹ رکھیں', 'ویب سائٹ یو آر ایلز محتاطی سے چیک کریں'],
    dontEn: ['Never download from untrusted sites', 'Never disable security warnings', 'Never ignore browser warnings'],
    dontUr: ['کبھی غیر بھروسہ مند سائٹوں سے ڈاؤنلوڈ نہ کریں', 'کبھی سیکیورٹی وارننگز غیر فعال نہ کریں', 'کبھی براؤزر وارننگز نظرانداز نہ کریں'] },
  { id: 'otp-safety', titleEn: 'OTP Safety', titleUr: 'او ٹی پی حفاظت', icon: 'KeyRound',
    whatIsEn: 'OTP safety means never sharing your verification codes with anyone, as legitimate services will never ask for them.', whatIsUr: 'او ٹی پی حفاظت کا مطلب ہے کہ اپنے تصدیقی کوڈز کسی کو بھی_share نہ کریں، کیونکہ جائز سروسز کبھی ان کی درخواست نہیں کرتیں۔',
    whyEn: 'Sharing OTPs gives attackers access to your accounts even without your password.', whyUr: 'او ٹی پیز شیئر کرنے سے حملہ آورز کو آپ کے پاس ورڈ کے بغیر بھی آپ کے اکاؤنٹس تک رسائی مل جاتی ہے۔',
    signsEn: ['Anyone asking for your OTP', 'Messages saying OTP was sent by mistake', 'Phone calls asking for codes'],
    signsUr: ['کوئی بھی جو آپ کا او ٹی پی مانگے', 'پیغامات جو کہتے ہیں او ٹی پی غلطی سے بھیجا گیا', 'کوڈز مانگنے والی فون کالز'],
    exampleEn: '"Hi, I\'m from your bank. Please read me the code sent to your phone."', exampleUr: '"میں آپ کے بینک سے ہوں۔ براہ کہ اپنے فون پر بھیجا گیا کوڈ بتائیں۔"',
    doEn: ['Treat OTPs like passwords', 'Only enter on official websites you initiated', 'Report suspicious requests immediately'],
    doUr: ['او ٹی پیز کو پاس ورڈز کی طرح سمجھیں', 'صرف اپنے شروع کردہ سرکاری ویب سائٹس پر درج کریں', 'فوری طور پر مشکوک درخواستیں رپورٹ کریں'],
    dontEn: ['Never share OTPs over phone or text', 'Never read codes aloud', 'Never enter OTPs on unfamiliar sites'],
    dontUr: ['کبھی فون یا ٹیکسٹ پر او ٹی پیز شیئر نہ کریں', 'کبھی کوڈز بلند آواز میں نہ پڑھیں', 'کبھی نامعلوم سائٹس پر او ٹی پیز درج نہ کریں'] },
  { id: 'social-engineering', titleEn: 'Social Engineering', titleUr: 'سوشل انجینئرنگ', icon: 'Users',
    whatIsEn: 'Social engineering is manipulating people into giving up confidential information or performing actions that benefit the attacker.', whatIsUr: 'سوشل انجینئرنگ لوگوں کو خفیہ معلومات دینے یا ایسی کارروائیاں کرنے پر مجبور کرنے کا فن ہے جو حملہ آور کو فائدہ پہنچائیں۔',
    whyEn: 'Social engineers exploit human psychology, making attacks hard to detect.', whyUr: 'سوشل انجینئرز انسانی نفسیات کا استعمال کرتے ہیں، حملوں کو دریافت کرنا مشکل بنا دیتے ہیں۔',
    signsEn: ['Unsolicited calls claiming tech support', 'Pressure to act quickly', 'Requests to bypass security', 'Emotional manipulation'],
    signsUr: ['ٹیک سپورٹ کا دعوی کرنے والی غیر مطلوبہ کالز', 'فوری کارروائی کا دباؤ', 'سیکیورٹی کو نظرانداز کرنے کی درخواستیں', 'جذباتی دباؤ'],
    exampleEn: '"This is Microsoft Support. We detected a virus. We need remote access."', exampleUr: '"مایکروسافٹ سپورٹ ہے۔ ہمیں وائرس ملا۔ ہمیں ریموٹ رسائی چاہیے۔"',
    doEn: ['Verify identity of anyone requesting access', 'Take your time — legitimate requests wait', 'Contact through official channels'],
    doUr: ['رسائی مانگنے والے کی شناخت کی تصدیق کریں', 'آہستہ آہستہ چلیں — جائز درخواستیں انتظار کرتی ہیں', 'سرکاری چینلز کے ذریعے رابطہ کریں'],
    dontEn: ['Never give remote access to unsolicited callers', 'Never make decisions under pressure', 'Never bypass security procedures'],
    dontUr: ['کبھی غیر مطلوبہ کالرز کو ریموٹ رسائی نہ دیں', 'کبھی دباؤ میں فیصلے نہ کریں', 'کبھی سیکیورٹی طریقہ کار نظرانداز نہ کریں'] },
  { id: 'online-privacy', titleEn: 'Online Privacy', titleUr: 'آن لائن رازداری', icon: 'Eye',
    whatIsEn: 'Online privacy is protecting your personal information and controlling how it\'s shared on the internet.', whatIsUr: 'آن لائن رازداری آپ کی ذاتی معلومات کی حفاظت ہے اور اس کنٹرول ہے کہ انٹرنیٹ پر کیسے شیئر ہوتی ہیں۔',
    whyEn: 'Loss of privacy can lead to identity theft, stalking, and financial fraud.', whyUr: 'رازداری کی کمی شناخت چوری، تعاقب اور مالی فراڈ کا سبب بن سکتی ہے۔',
    signsEn: ['Apps requesting unnecessary permissions', 'Social media oversharing', 'Public WiFi without passwords'],
    signsUr: ['غیر ضروری اجازتیں مانگنے والے ایپس', 'سوشل میڈیا پر زیادہ معلومات شیئر کرنا', 'بغیر پاس ورڈ کے پبلک وائی فائی'],
    exampleEn: 'A flashlight app requesting access to contacts and camera', exampleUr: 'ایک ٹارچ لائٹ ایپ جو رابطے اور کیمرے تک رسائی مانگتا ہے',
    doEn: ['Review app permissions', 'Use strong privacy settings on social media', 'Use a VPN on public WiFi'],
    doUr: ['ایپ اجازتوں کا جائزہ لیں', 'سوشل میڈیا پر مضبوط رازداری ترتیبات استعمال کریں', 'پبلک وائی فائی پر VPN استعمال کریں'],
    dontEn: ['Never overshare personal information', 'Never use unencrypted public WiFi', 'Never accept default privacy settings'],
    dontUr: ['کبھی زیادہ ذاتی معلومات شیئر نہ کریں', 'کبھی غیر انکرپٹڈ پبلک وائی فائی استعمال نہ کریں', 'کبھی ڈیفالٹ رازداری ترتیبات قبول نہ کریں'] },
  { id: 'account-security', titleEn: 'Account Security', titleUr: 'اکاؤنٹ کی حفاظت', icon: 'UserCheck',
    whatIsEn: 'Account security involves protecting your online accounts through strong passwords, 2FA, and monitoring.', whatIsUr: 'اکاؤنٹ کی حفاظت میں مضبوط پاس ورڈز، 2FA اور نگرانی کے ذریعے آپ کے آن لائن اکاؤنٹس کی حفاظت شامل ہے۔',
    whyEn: 'Compromised accounts can lead to financial loss and identity theft.', whyUr: 'ختم شدہ اکاؤنٹس مالی نقصان اور شناخت چوری کا سبب بن سکتے ہیں۔',
    signsEn: ['Password reset emails you didn\'t request', 'Login from unknown devices', 'Friends receiving messages you didn\'t send'],
    signsUr: ['پاس ورڈ ری سیٹ ای میلز جو آپ نے نہیں مانگیں', 'نامعلوم ڈیوائسز سے لاگ ان', 'دوست جو آپ کے نہیں بھیجے پیغامات موصول کر رہے ہیں'],
    exampleEn: 'You receive a password reset email you didn\'t request.', exampleUr: 'آپ کو پاس ورڈ ری سیٹ ای میل ملی جو آپ نے نہیں مانگی۔',
    doEn: ['Enable 2FA everywhere', 'Use unique passwords', 'Review login activity regularly'],
    doUr: ['ہر جگہ 2FA فعال کریں', 'منفرد پاس ورڈز استعمال کریں', 'باقاعدگی سے لاگ ان سرگرمیاں جانچیں'],
    dontEn: ['Never use same password everywhere', 'Never ignore security alerts', 'Never share account credentials'],
    dontUr: ['کبھی ہر جگہ ایک ہی پاس ورڈ استعمال نہ کریں', 'کبھی سیکیورٹی ا alerts نظرانداز نہ کریں', 'کبھی اکاؤنٹ تفصیلات شیئر نہ کریں'] },
  { id: 'suspicious-links', titleEn: 'Suspicious Links', titleUr: 'مشکوک لنکس', icon: 'Link',
    whatIsEn: 'Suspicious links are URLs that may lead to malicious websites designed to steal your information.', whatIsUr: 'مشکوک لنکس وی آر ایلز ہیں جو آپ کی معلومات چوری کرنے والی خطرناک ویب سائٹوں کی طرف لے جا سکتے ہیں۔',
    whyEn: 'Clicking malicious links can lead to credential theft and malware.', whyUr: 'خطرناک لنکس پر کلک کرنے سے تفصیلات چوری اور میلویئر ہو سکتا ہے۔',
    signsEn: ['URLs that don\'t match claimed destination', 'Shortened URLs', 'IP addresses instead of domains', 'Misspelled popular websites'],
    signsUr: ['یو آر ایلز جو دعوی کردہ منزل سے مماثل نہیں', 'مختصر شدہ یو آر ایلز', 'ڈومینز کی بجائے آئی پی ایڈریسز', 'غلط ہجے والے مشہور ویب سائٹس'],
    exampleEn: 'http://amaz0n-security.com/signin — misspelled Amazon with zero', exampleUr: 'http://amaz0n-security.com/signin — غلط املن جس میں صفر ہے',
    doEn: ['Hover over links to preview URL', 'Look for HTTPS and correct spelling', 'Type important addresses directly'],
    doUr: ['یو آر ایل پیش نظارہ کے لیے لنکس پر لیک کریں', 'HTTPS اور صحیح ہجے کو چیک کریں', 'اہم پتے براہ راست ٹائپ کریں'],
    dontEn: ['Never click links without verifying', 'Never trust links in unsolicited messages', 'Never enter passwords on unfamiliar sites'],
    dontUr: ['کبھی تصدیق کے بغیر لنکس نہ کلک کریں', 'کبھی غیر مطلوبہ پیغامات کے لنکس پر بھروسہ نہ کریں', 'کبھی نامعلوم سائٹس پر پاس ورڈز درج نہ کریں'] },
];

export function Learn() {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const topic = topics.find(tp => tp.id === selectedTopic);
  const isUrdu = t('en', 'ur') === 'ur';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('Learn Cyber Security', 'سائبر سیکیورٹی سیکھیں')}</h1>
        <p className="text-graphite-400 text-lg max-w-2xl mx-auto">{t('Educational resources to help you understand and protect yourself from digital threats.', 'ڈیجیٹل خطرات کو سمجھنے اور خود کو بچانے میں آپ کی مدد کے لیے تعلیمی وسائل۔')}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!topic ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((tp, i) => {
              const Icon = iconMap[tp.icon] || BookOpen;
              return (
                <motion.button key={tp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedTopic(tp.id)} className="glass-card-hover p-6 text-left group">
                  <div className="w-10 h-10 rounded-lg bg-magenta/10 flex items-center justify-center mb-4 group-hover:bg-magenta/20 transition-colors">
                    <Icon className="w-5 h-5 text-magenta" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{isUrdu ? tp.titleUr : tp.titleEn}</h3>
                  <p className="text-sm text-graphite-400 line-clamp-2">{isUrdu ? tp.whatIsUr : tp.whatIsEn}</p>
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button onClick={() => setSelectedTopic(null)} className="btn-secondary mb-6">← {t('Back to Topics', 'موضوعات پر واپس')}</button>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">{isUrdu ? topic.titleUr : topic.titleEn}</h2>
              <div className="glass-card p-6"><h3 className="font-semibold text-teal-400 mb-2">{t('What is it?', 'یہ کیا ہے؟')}</h3><p className="text-graphite-300">{isUrdu ? topic.whatIsUr : topic.whatIsEn}</p></div>
              <div className="glass-card p-6"><h3 className="font-semibold text-amber-400 mb-2">{t('Why is it dangerous?', 'یہ خطرناک کیوں ہے؟')}</h3><p className="text-graphite-300">{isUrdu ? topic.whyUr : topic.whyEn}</p></div>
              <div className="glass-card p-6"><h3 className="font-semibold text-danger mb-3">{t('Warning Signs', 'خبرداری کی نشانیاں')}</h3>
                <ul className="space-y-2">{(isUrdu ? topic.signsUr : topic.signsEn).map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-graphite-300"><AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />{s}</li>)}</ul>
              </div>
              <div className="glass-card p-6 border-l-4 border-magenta"><h3 className="font-semibold text-magenta mb-2">{t('Example', 'مثال')}</h3><p className="text-graphite-300 italic">{isUrdu ? topic.exampleUr : topic.exampleEn}</p></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6"><h3 className="font-semibold text-emerald-400 mb-3">{t('What to Do', 'کیا کریں')}</h3>
                  <ul className="space-y-2">{(isUrdu ? topic.doUr : topic.doEn).map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-graphite-300"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />{item}</li>)}</ul>
                </div>
                <div className="glass-card p-6"><h3 className="font-semibold text-danger mb-3">{t('What NOT to Do', 'کیا نہ کریں')}</h3>
                  <ul className="space-y-2">{(isUrdu ? topic.dontUr : topic.dontEn).map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-graphite-300"><XCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />{item}</li>)}</ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
