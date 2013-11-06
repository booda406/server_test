class Product < ActiveRecord::Base
	mount_uploader :image, ImageUploader
	#stores the file
  def upload(file)
  	self.path.store!(file)
  end
  
#converts the data from hex to a string -> found code here http://4thmouse.com/index.php/2008/02/18/converting-hex-to-binary-in-4-languages/
  def hex_to_string(hex)
 	temp = hex.gsub("\s", "");
    ret = []
    (0...temp.size()/2).each{|index| ret[index] = [temp[index*2, 2]].pack("H2")}
    file = String.new
    ret.each { |x| file << x}
    file  
  end
end
