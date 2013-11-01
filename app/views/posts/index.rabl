collection @posts

attributes :title, :body

node :is_recent do |post|
	post.created_at < 1.week.ago
end
