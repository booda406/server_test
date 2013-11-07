class Project < ActiveRecord::Base
  has_many :avatars, class_name: 'Test', dependent: :destroy
  #has_many :tasks
  #accepts_nested_attributes_for :tasks, :reject_if => :all_blank, :allow_destroy => true
  accepts_nested_attributes_for :avatars
end
